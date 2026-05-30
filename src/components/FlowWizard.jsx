import React, { useState, useMemo, useEffect, useRef } from 'react';
import FLOWS from '../data/flows.js';
import StepScreen from './StepScreen.jsx';
import DoneScreen from './DoneScreen.jsx';

export default function FlowWizard({ flowId, onBack }) {
  const flow = FLOWS[flowId];

  const [answers,   setAnswers]   = useState({});
  const [stepIndex, setStepIndex] = useState(0);
  const [done,      setDone]      = useState(false);

  // ── Animasyon state makinesi ──────────────────────────────────
  // 'idle' → 'exiting' (220ms) → 'entering' (260ms) → 'idle'
  const [phase,     setPhase]     = useState('idle');
  const [direction, setDirection] = useState('forward');
  const pendingAction             = useRef(null);

  useEffect(() => {
    if (phase === 'exiting') {
      const t = setTimeout(() => {
        pendingAction.current?.();
        pendingAction.current = null;
        setPhase('entering');
      }, 220);
      return () => clearTimeout(t);
    }
    if (phase === 'entering') {
      const t = setTimeout(() => setPhase('idle'), 260);
      return () => clearTimeout(t);
    }
  }, [phase]);

  function navigate(dir, action) {
    if (phase !== 'idle') return;
    pendingAction.current = action;
    setDirection(dir);
    setPhase('exiting');
  }

  // ── Görünür adımlar ────────────────────────────────────────────
  const visibleSteps = useMemo(() => {
    return flow.steps
      .filter((s) => !s.condition || s.condition(answers))
      .map((s, i) => ({
        ...s,
        fiyatBadge: i === 0 ? flow.fiyatBadge : undefined,
      }));
  }, [flow, answers]);

  const currentStep = visibleSteps[stepIndex];
  const totalSteps  = visibleSteps.length;

  // ── Answer / navigation handlers ──────────────────────────────
  function handleAnswer(key, val) {
    setAnswers((prev) => ({ ...prev, [key]: val }));
  }

  function handleNext() {
    navigate('forward', () => {
      if (stepIndex < totalSteps - 1) setStepIndex((i) => i + 1);
      else setDone(true);
    });
  }

  function handleBack() {
    if (stepIndex > 0) {
      navigate('backward', () => setStepIndex((i) => i - 1));
    } else {
      onBack();
    }
  }

  function handleSkip() {
    if (currentStep?.id) {
      setAnswers((prev) => {
        const next = { ...prev };
        delete next[currentStep.id];
        if (currentStep.id === 'ilce') delete next.mahalle;
        return next;
      });
    }
    handleNext();
  }

  function handleRestart() {
    setAnswers({});
    setStepIndex(0);
    setDone(false);
    setPhase('idle');
  }

  if (done) {
    return (
      <DoneScreen
        flowId={flowId}
        answers={answers}
        onRestart={handleRestart}
        onHome={onBack}
      />
    );
  }

  if (!currentStep) return null;

  // CSS sınıfı: çıkış animasyonu mevcut adıma, giriş animasyonu yeni adıma
  const transitionClass =
    phase === 'exiting'
      ? (direction === 'forward' ? 'screen-exit' : 'screen-exit-back')
      : phase === 'entering'
        ? (direction === 'forward' ? 'screen-enter' : 'screen-enter-back')
        : '';

  return (
    <StepScreen
      key={`${currentStep.id}-${stepIndex}`}
      step={currentStep}
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      answers={answers}
      onAnswer={handleAnswer}
      onNext={handleNext}
      onBack={handleBack}
      onSkip={handleSkip}
      isFirst={stepIndex === 0}
      transitionClass={transitionClass}
    />
  );
}
