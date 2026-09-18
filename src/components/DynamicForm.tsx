/**
 * DynamicForm.tsx
 *
 * Renderizador dinâmico de formulário com PAGINAÇÃO POR SEÇÃO.
 *
 * ┌──────────────────────────────────────────────────────────────┐
 * │ WRAPPER: DynamicForm controla formKey para remount.          │
 * │ BODY: FormBody contém useForm e toda lógica interna.         │
 * │                                                              │
 * │ LÓGICA CONDICIONAL (BRANCHING LOGIC)                         │
 * │ LIMPEZA DE CAMPOS OCULTOS                                    │
 * │ PERSISTÊNCIA EM localStorage                                 │
 * └──────────────────────────────────────────────────────────────┘
 */

import { useForm, type FieldValues } from 'react-hook-form';
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, AlertCircle, LayoutGrid, Download, Info, Trash2 } from 'lucide-react';
import type { FormSchema, FormQuestion, FormSection, FormData } from '../types/form';

/* ── Props ───────────────────────────────────────────────────── */

interface DynamicFormProps {
  schema: FormSchema;
  onGeneratePdf: (data: FormData) => void;
  onProgress?: (filled: number, total: number) => void;
  onStepChange?: (current: number, total: number, sectionTitle: string) => void;
}

/* ── Helpers ─────────────────────────────────────────────────── */

function isQuestionVisible(question: FormQuestion, values: FieldValues): boolean {
  if (!question.condition) return true;
  const { dependsOn, value, operator } = question.condition;
  const dependentValue = values[dependsOn];
  const match = Array.isArray(value)
    ? value.includes(String(dependentValue))
    : dependentValue === value;
  return operator === 'not_equals' ? !match : match;
}

function flattenQuestionIds(sections: FormSection[]): string[] {
  const ids: string[] = [];
  for (const section of sections) {
    for (const q of section.questions) {
      if (q.type === 'matrix' && q.matrixRows) {
        for (const row of q.matrixRows) ids.push(row.id);
      }
      ids.push(q.id);
      if (q.linkedField) ids.push(q.linkedField.id);
    }
  }
  return ids;
}

function collectVisibleIds(questions: FormQuestion[], values: FieldValues): string[] {
  const ids: string[] = [];
  for (const q of questions) {
    if (!isQuestionVisible(q, values)) continue;
    ids.push(q.id);
    if (q.type === 'matrix' && q.matrixRows) {
      for (const row of q.matrixRows) ids.push(row.id);
    }
    if (q.linkedField) ids.push(q.linkedField.id);
  }
  return ids;
}

const baseInputClasses = (hasError: boolean) =>
  `w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-800
   transition-all duration-200 outline-none placeholder:text-slate-400
   focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600
   ${hasError ? 'border-red-400 ring-1 ring-red-200' : 'border-slate-300 hover:border-slate-400'}`;

/* ── Tipos auxiliares ───────────────────────────────────────── */

interface FieldProps {
  question: FormQuestion;
  register: ReturnType<typeof useForm>['register'];
  hasError?: boolean;
}

interface MatrixFieldProps extends FieldProps {
  errors: Record<string, unknown>;
}

/* ── Sub-componentes de campo ────────────────────────────────── */

function TextField({ question, register, hasError = false }: FieldProps) {
  return (
    <input type="text" placeholder={question.placeholder} className={baseInputClasses(hasError)}
      {...register(question.id, { required: question.required })} />
  );
}

function NumberField({ question, register, hasError = false }: FieldProps) {
  return (
    <input type="number" placeholder={question.placeholder} min="0" className={baseInputClasses(hasError)}
      {...register(question.id, { required: question.required })} />
  );
}

function TextareaField({ question, register, hasError = false }: FieldProps) {
  return (
    <textarea rows={4} placeholder={question.placeholder}
      className={`${baseInputClasses(hasError)} resize-none`}
      {...register(question.id, { required: question.required })} />
  );
}

function DateField({ question, register, hasError = false }: FieldProps) {
  return (
    <input type="date" className={baseInputClasses(hasError)}
      {...register(question.id, { required: question.required })} />
  );
}

function SelectField({ question, register, hasError = false }: FieldProps) {
  return (
    <select className={baseInputClasses(hasError)} {...register(question.id, { required: question.required })}>
      <option value="">Selecione uma opção...</option>
      {question.options?.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
}

function RadioField({ question, register }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      {question.options?.map((opt) => (
        <label key={opt}
          className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3
                     cursor-pointer transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/50
                     has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 has-[:checked]:ring-1 has-[:checked]:ring-blue-200">
          <input type="radio" value={opt} className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            {...register(question.id, { required: question.required })} />
          <span className="text-sm text-slate-700">{opt}</span>
        </label>
      ))}
    </div>
  );
}

function CheckboxField({ question, register }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      {question.options?.map((opt) => (
        <label key={opt}
          className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3
                     cursor-pointer transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/50
                     has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 has-[:checked]:ring-1 has-[:checked]:ring-blue-200">
          <input type="checkbox" value={opt} className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
            {...register(question.id)} />
          <span className="text-sm text-slate-700">{opt}</span>
        </label>
      ))}
    </div>
  );
}

function ScaleField({ question, register }: FieldProps) {
  const max = question.scaleMax ?? 5;
  const values = Array.from({ length: max }, (_, i) => String(i + 1));
  return (
    <div className="flex flex-wrap gap-3">
      {values.map((val) => (
        <label key={val}
          className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-200
                     bg-white text-sm font-semibold text-slate-600 cursor-pointer
                     transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/50
                     has-[:checked]:border-blue-600 has-[:checked]:bg-blue-600 has-[:checked]:text-white
                     has-[:checked]:ring-2 has-[:checked]:ring-blue-200">
          <input type="radio" value={val} className="sr-only"
            {...register(question.id, { required: question.required })} />
          {val}
        </label>
      ))}
    </div>
  );
}

function MatrixField({ question, register, hasError, errors }: MatrixFieldProps) {
  const yesNo = ['Sim', 'Não'];
  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="py-2 pr-4 text-left font-medium text-slate-500 w-1/2">Critério</th>
            {yesNo.map((opt) => (
              <th key={opt} className="py-2 px-4 text-center font-medium text-slate-500 w-1/4">{opt}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {question.matrixRows?.map((row) => {
            const rowError = errors?.[row.id];
            return (
              <tr key={row.id}
                className={`border-b border-slate-100 transition-colors hover:bg-slate-50/50 ${rowError ? 'bg-red-50/30' : ''}`}>
                <td className="py-3 pr-4 text-slate-700 font-medium text-sm">{row.label}</td>
                {yesNo.map((opt) => (
                  <td key={opt} className="py-3 px-4 text-center">
                    <label className="inline-flex cursor-pointer items-center justify-center">
                      <input type="radio" value={opt} className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        {...register(row.id, { required: question.required })} />
                    </label>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      {hasError && (
        <p className="mt-2 text-xs text-red-500 flex items-center gap-1.5">
          <AlertCircle size={14} />
          Todos os campos da matriz são obrigatórios
        </p>
      )}
    </div>
  );
}

function ErrorMessage() {
  return (
    <div className="mt-1 flex items-center gap-1.5 text-xs text-red-500">
      <AlertCircle size={14} />
      <span>Este campo é obrigatório</span>
    </div>
  );
}

function QuestionField({ question, register, errors }: {
  question: FormQuestion;
  register: ReturnType<typeof useForm>['register'];
  errors: Record<string, unknown>;
}) {
  const hasError = !!errors[question.id];
  const fieldMap: Record<string, JSX.Element> = {
    text: <TextField question={question} register={register} hasError={hasError} />,
    number: <NumberField question={question} register={register} hasError={hasError} />,
    textarea: <TextareaField question={question} register={register} hasError={hasError} />,
    date: <DateField question={question} register={register} hasError={hasError} />,
    select: <SelectField question={question} register={register} hasError={hasError} />,
    radio: <RadioField question={question} register={register} />,
    checkbox: <CheckboxField question={question} register={register} />,
    matrix: <MatrixField question={question} register={register} hasError={hasError} errors={errors} />,
    scale: <ScaleField question={question} register={register} />,
  };
  return fieldMap[question.type] ?? null;
}

/* ── Persistência no cache local ───────────────────────────── */

const STORAGE_KEY = 'avalia-cap53-form-state';

/* ── Wrapper: controla remount via formKey ──────────────────── */

export default function DynamicForm({ schema, onGeneratePdf, onProgress, onStepChange }: DynamicFormProps) {
  const [formKey, setFormKey] = useState(0);

  const handleClearRequest = useCallback(() => {
    setFormKey((k) => k + 1);
  }, []);

  return (
    <FormBody
      key={formKey}
      schema={schema}
      onGeneratePdf={onGeneratePdf}
      onProgress={onProgress}
      onStepChange={onStepChange}
      onClear={handleClearRequest}
    />
  );
}

/* ── Corpo do formulário (remountado via key) ────────────────── */

interface FormBodyProps extends DynamicFormProps {
  onClear: () => void;
}

function FormBody({ schema, onGeneratePdf, onProgress, onStepChange, onClear }: FormBodyProps) {
  const { register, handleSubmit, watch, resetField, trigger, reset, formState: { errors } } = useForm();
  const watchedValues = watch();

  // ── Paginação ─────────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState(0);
  const [validationMsg, setValidationMsg] = useState<string | null>(null);
  const validationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydration: restaura dados e página salvos (ex.: após F5)
  const hydratedRef = useRef(false);
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { values?: FieldValues; step?: number };
      if (saved.values && typeof saved.values === 'object') {
        reset(saved.values);
      }
      if (typeof saved.step === 'number' && Number.isFinite(saved.step)) {
        setCurrentStep(Math.min(Math.max(saved.step, 0), schema.sections.length - 1));
      }
    } catch {
      /* cache corrompido ou indisponível: ignora */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Salva valores + página atual no cache a cada alteração
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ values: watchedValues, step: currentStep }));
    } catch {
      /* armazenamento indisponível: ignora */
    }
  }, [watchedValues, currentStep]);

  /** Seções filtradas (mantém apenas perguntas visíveis) */
  const visibleSections = useMemo(() => {
    return schema.sections.map((section) => ({
      ...section,
      questions: section.questions.filter((q) => isQuestionVisible(q, watchedValues)),
    }));
  }, [schema.sections, watchedValues]);

  const totalSteps = visibleSections.length;
  const currentSection = visibleSections[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  // Reporta mudança de seção ao pai
  useEffect(() => {
    onStepChange?.(currentStep, totalSteps, currentSection?.title ?? '');
  }, [currentStep, totalSteps, currentSection?.title, onStepChange]);

  // Limpa timer do toast no unmount
  useEffect(() => {
    return () => { if (validationTimerRef.current) clearTimeout(validationTimerRef.current); };
  }, []);

  // ── Limpeza de campos ocultos ─────────────────────────────
  const prevVisibleIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const currentVisibleIds = new Set(
      visibleSections.flatMap((s) => collectVisibleIds(s.questions, watchedValues))
    );
    const prevVisibleIds = prevVisibleIdsRef.current;
    if (prevVisibleIds.size > 0) {
      for (const id of prevVisibleIds) {
        if (!currentVisibleIds.has(id)) {
          try { resetField(id, { defaultValue: undefined }); } catch { /* ok */ }
        }
      }
    }
    prevVisibleIdsRef.current = currentVisibleIds;
  }, [visibleSections, watchedValues, resetField]);

  // ── Progresso geral ───────────────────────────────────────
  const progress = useMemo(() => {
    let total = 0;
    let filled = 0;
    for (const section of visibleSections) {
      for (const q of section.questions) {
        if (q.type === 'matrix' && q.required && q.matrixRows) {
          for (const row of q.matrixRows) {
            total++;
            if (watchedValues[row.id]) filled++;
          }
        } else if (q.required) {
          total++;
          const val = watchedValues[q.id];
          if (Array.isArray(val)) { if (val.length > 0) filled++; }
          else if (val !== undefined && val !== '') filled++;
        }
        if (q.linkedField?.required) {
          total++;
          const lfVal = watchedValues[q.linkedField.id];
          if (lfVal !== undefined && lfVal !== '') filled++;
        }
      }
    }
    return { filled, total };
  }, [visibleSections, watchedValues]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => onProgress?.(progress.filled, progress.total), [progress.filled, progress.total, onProgress]);

  const currentVisibleIds = useMemo(
    () => (currentSection ? collectVisibleIds(currentSection.questions, watchedValues) : []),
    [currentSection, watchedValues]
  );

  /**
   * Mapa global de numeração sequencial.
   * Perguntas condicionais recebem número inteiro (ex.: 44, 45, 46...)
   * em vez de subnúmero (43.1). Perguntas seguintes somam +1.
   */
  const questionNumberMap = useMemo(() => {
    const map = new Map<string, number>();
    let seq = 1;
    for (const section of schema.sections) {
      for (const q of section.questions) {
        map.set(q.id, seq++);
        if (q.linkedField) {
          map.set(q.linkedField.id, seq++);
        }
        if (q.type === 'matrix' && q.matrixRows) {
          for (const row of q.matrixRows) {
            map.set(row.id, seq++);
          }
        }
      }
    }
    return map;
  }, [schema.sections]);

  /** Navega para a próxima seção */
  const goNext = useCallback(async () => {
    const valid = await trigger(currentVisibleIds as never[]);
    if (!valid) {
      const firstErrorId = currentVisibleIds.find((id) => {
        const el = document.querySelector(`[name="${id}"]`);
        if (!el) return false;
        if (el instanceof HTMLInputElement && el.type === 'radio') {
          return !document.querySelector(`[name="${id}"]:checked`);
        }
        const val = (el as HTMLInputElement).value;
        return !val || !val.trim();
      });
      if (firstErrorId) {
        document.querySelector(`[name="${firstErrorId}"]`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (validationTimerRef.current) clearTimeout(validationTimerRef.current);
      setValidationMsg('Existem campos obrigatórios que precisam ser preenchidos.');
      validationTimerRef.current = setTimeout(() => setValidationMsg(null), 4000);
      return;
    }
    setValidationMsg(null);
    setCurrentStep((s) => Math.min(s + 1, totalSteps - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [trigger, currentVisibleIds, totalSteps]);

  /** Navega para a seção anterior */
  const goPrev = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /** Limpa todo o formulário (com confirmação dupla) */
  const handleClearForm = useCallback(() => {
    const confirmed = window.confirm(
      'Tem certeza que deseja apagar todas as respostas?\n\nTodo o preenchimento atual será perdido.'
    );
    if (!confirmed) return;
    const doubleCheck = window.confirm(
      'Último aviso: Esta ação não pode ser desfeita.\n\nDeseja realmente limpar todo o formulário?'
    );
    if (!doubleCheck) return;
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ok */ }
    onClear();
  }, [onClear]);

  /** Gera PDF com os dados do formulário */
  const handleFormSubmit = useCallback(
    (data: FieldValues) => {
      const allIds = flattenQuestionIds(schema.sections);
      const visibleIds = new Set(
        visibleSections.flatMap((s) => collectVisibleIds(s.questions, watchedValues))
      );
      const filteredData: FormData = {};
      for (const id of allIds) {
        if (visibleIds.has(id) && data[id] !== undefined) {
          filteredData[id] = data[id];
        }
      }
      onGeneratePdf(filteredData);
    },
    [schema.sections, visibleSections, watchedValues, onGeneratePdf]
  );

  const progressPercent = progress.total > 0 ? Math.round((progress.filled / progress.total) * 100) : 0;

  return (
    <form className="space-y-6">
      {/* ── Toast de validação sutil ───────────────────── */}
      {validationMsg && (
        <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 animate-fade-in
          flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50/95
          px-5 py-3 shadow-lg shadow-amber-100/50 backdrop-blur-sm max-w-sm">
          <Info size={16} className="shrink-0 text-amber-600" />
          <span className="text-sm font-medium text-amber-800">{validationMsg}</span>
        </div>
      )}

      {/* ── Barra de progresso por seção ────────────────── */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500">
            Seção {currentStep + 1} de {totalSteps}
          </span>
          <span className="text-xs font-semibold text-blue-700">{progressPercent}%</span>
        </div>

        <div className="flex gap-1.5 mb-3">
          {visibleSections.map((section, i) => (
            <button
              key={section.id}
              type="button"
              onClick={() => { setCurrentStep(i); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`h-2 flex-1 rounded-full transition-all duration-300 cursor-pointer
                ${i < currentStep ? 'bg-blue-600' : i === currentStep ? 'bg-blue-400' : 'bg-slate-200'}`}
              title={section.title}
            />
          ))}
        </div>

        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }} />
        </div>

        <p className="mt-2 text-xs text-slate-400 text-center">{progress.filled} de {progress.total} campos obrigatórios preenchidos</p>
      </div>

      {/* ── Botão limpar (discreto, abaixo da barra de progresso) ── */}
      <div className="flex justify-center">
        <button type="button" onClick={handleClearForm}
          className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium
                     text-slate-300 transition-all duration-200 hover:text-red-400 active:scale-[0.97]">
          <Trash2 size={11} />
          Limpar formulário
        </button>
      </div>

      {/* ── Seção atual ────────────────────────────────── */}
      {currentSection && (
        <section className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-900 text-sm font-bold text-white">
              {currentSection.number}
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-800">{currentSection.title}</h2>
              {currentSection.description && (
                <p className="text-xs text-slate-500 mt-0.5">{currentSection.description}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {currentSection.questions.map((question) => {
              const error = errors[question.id];
              const isMatrix = question.type === 'matrix';
              const linkedError = question.linkedField ? errors[question.linkedField.id] : undefined;
              const questionNumber = questionNumberMap.get(question.id) ?? '?';
              return (
                <div key={question.id}
                  className="animate-fade-in rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                  <div className="mb-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                      {isMatrix && <LayoutGrid size={14} className="text-blue-600" />}
                      <span className="text-blue-700">{questionNumber}.</span>
                      {question.label}
                      {question.required && <span className="text-red-500">*</span>}
                    </label>
                    {question.description && (
                      <p className="mt-1 text-xs text-slate-500">{question.description}</p>
                    )}
                  </div>

                  <QuestionField question={question} register={register} errors={errors} />
                  {!isMatrix && error && <ErrorMessage />}

                  {question.linkedField && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        {question.linkedField.label}
                        {question.linkedField.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <textarea rows={3} placeholder={question.linkedField.placeholder}
                        className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-800
                           transition-all duration-200 outline-none placeholder:text-slate-400
                           focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 resize-none
                           ${linkedError ? 'border-red-400 ring-1 ring-red-200' : 'border-slate-300 hover:border-slate-400'}`}
                        {...register(question.linkedField.id, { required: question.linkedField.required })} />
                      {linkedError && <ErrorMessage />}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Navegação ──────────────────────────────────── */}
      <div className="flex items-center gap-3 pt-2">
        {!isFirstStep && (
          <button type="button" onClick={goPrev}
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3
                       text-sm font-semibold text-slate-600 transition-all duration-200
                       hover:bg-slate-50 hover:border-slate-400 active:scale-[0.98]">
            <ChevronLeft size={18} />
            Anterior
          </button>
        )}

        <div className="flex-1" />

        {isLastStep ? (
          <button type="button" onClick={handleSubmit(handleFormSubmit)}
            className="flex items-center gap-2 rounded-xl bg-blue-900 px-6 py-3
                       text-sm font-semibold text-white shadow-lg shadow-blue-900/25
                       transition-all duration-200 hover:bg-blue-800 hover:shadow-xl
                       active:scale-[0.98]">
            <Download size={18} />
            Gerar arquivo em PDF
          </button>
        ) : (
          <button type="button" onClick={goNext}
            className="flex items-center gap-2 rounded-xl bg-blue-900 px-6 py-3
                       text-sm font-semibold text-white shadow-lg shadow-blue-900/25
                       transition-all duration-200 hover:bg-blue-800 hover:shadow-xl
                       active:scale-[0.98]">
            Próxima
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </form>
  );
}
