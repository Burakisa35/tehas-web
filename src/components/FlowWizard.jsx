import React, { useState, useMemo } from 'react';
import FLOWS from '../data/flows.js';
import StepScreen from './StepScreen.jsx';
import DoneScreen from './DoneScreen.jsx';

export default function FlowWizard({ flowId, onBack }) {
  const flow = FLOWS[flowId];

  const [answers, setAnswers] = useState({});
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState(false);

  // Görünür adımları hesapla — conditional step'leri filtrele
  const visibleSteps = useMemo(() => {
    // Her hizmetin ilk adımına fiyat badge'ini ekle
    return flow.steps
      .filter((s) => !s.condition || s.condition(answers))
      .map((s, i) => ({
        ...s,
        fiyatBadge: i === 0 ? flow.fiyatBadge : undefined,
      }));
  }, [flow, answers]);

  const currentStep = visibleSteps[stepIndex];
  const totalSteps  = visibleSteps.length;

  function handleAnswer(key, val) {
    setAnswers((prev) => ({ ...prev, [key]: val }));
  }

  function handleNext() {
    if (stepIndex < totalSteps - 1) {
      setStepIndex((i) => i + 1);
    } else {
      setDone(true);
    }
  }

  function handleBack() {
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1);
    } else {
      onBack();
    }
  }

  function handleSkip() {
    // Atla = cevabı temizle ve ilerle
    if (currentStep?.id) {
      setAnswers((prev) => {
        const next = { ...prev };
        delete next[currentStep.id];
        // Konum adımında mahalle'yi de temizle
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
    />
  );
}
