import { useCallback } from 'react';
import { CheckCircle, Download, FileText, Shield } from 'lucide-react';
import type { FormSchema, FormData, FormSection } from '../types/form';
import { generatePdf } from './PdfExport';

interface SuccessViewProps {
  schema: FormSchema;
  formData: FormData;
  protocolNumber: string;
  submissionDate: Date;
}

/** Formata valor exibido a partir do valor bruto do form */
function formatValue(val: string | string[] | undefined): string {
  if (val === undefined || val === '') return '—';
  return Array.isArray(val) ? val.join(', ') : String(val);
}

export default function SuccessView({ schema, formData, protocolNumber, submissionDate }: SuccessViewProps) {
  const handleDownload = useCallback(() => {
    generatePdf({ schema, formData, protocolNumber, submissionDate });
  }, [schema, formData, protocolNumber, submissionDate]);

  const formattedDate = submissionDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="animate-fade-in flex flex-col items-center gap-8 py-12">
      {/* Ícone de sucesso */}
      <div className="relative">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-emerald-100 ring-4 ring-blue-200/50">
          <CheckCircle size={48} className="text-blue-700" strokeWidth={1.5} />
        </div>
        <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
          <CheckCircle size={18} />
        </div>
      </div>

      {/* Mensagem de confirmação */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">Formulário Enviado com Sucesso!</h2>
        <p className="mt-2 max-w-md text-sm text-slate-500">
          Seus dados foram registrados. Utilize o número de protocolo para consultas futuras.
        </p>
      </div>

      {/* Card do protocolo */}
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <FileText size={20} className="text-blue-700" />
          <h3 className="font-semibold text-slate-800">Comprovante de Envio</h3>
        </div>

        <div className="space-y-3 rounded-xl bg-slate-50 p-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Protocolo:</span>
            <span className="font-mono font-semibold text-slate-800">{protocolNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Data de emissão:</span>
            <span className="text-slate-800">{formattedDate}</span>
          </div>
        </div>

        {/* Resumo agrupado por seção */}
        <div className="mt-5 space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Resumo das Respostas
          </h4>
          {schema.sections.map((section: FormSection) => {
            // Filtra perguntas com dados respondidos
            const answeredQuestions = section.questions.filter((q) => {
              const val = formData[q.id];
              if (q.type === 'matrix' && q.matrixRows) {
                return q.matrixRows.some((row) => formData[row.id] !== undefined && formData[row.id] !== '');
              }
              return val !== undefined && val !== '';
            });
            if (answeredQuestions.length === 0) return null;

            return (
              <div key={section.id}>
                <p className="mb-1.5 text-xs font-bold text-blue-800">Seção {section.number}: {section.title}</p>
                <div className="space-y-1.5 rounded-lg bg-slate-50 p-3">
                  {answeredQuestions.map((q) => {
                    if (q.type === 'matrix' && q.matrixRows) {
                      return q.matrixRows.map((row) => {
                        const val = formData[row.id];
                        if (!val) return null;
                        return (
                          <div key={row.id} className="flex items-start gap-2 border-b border-slate-100 py-1.5 last:border-0">
                            <span className="text-xs text-slate-500 min-w-0 shrink-0 max-w-[45%]">{row.label}:</span>
                            <span className="text-xs font-medium text-slate-800">{formatValue(val)}</span>
                          </div>
                        );
                      });
                    }
                    const val = formData[q.id];
                    return (
                      <div key={q.id} className="flex items-start gap-2 border-b border-slate-100 py-1.5 last:border-0">
                        <span className="text-xs text-slate-500 min-w-0 shrink-0 max-w-[45%]">{q.label}:</span>
                        <span className="text-xs font-medium text-slate-800">{formatValue(val)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Botão de download */}
      <div className="flex flex-col gap-3 w-full max-w-lg">
        <button
          onClick={handleDownload}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-900 px-6 py-4
                     text-sm font-semibold text-white shadow-lg shadow-blue-900/25
                     transition-all duration-200 hover:bg-blue-800 hover:shadow-xl
                     active:scale-[0.98]"
        >
          <Download size={18} />
          Baixar Comprovante em PDF
        </button>
      </div>

      {/* Nota de rodapé */}
      <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-xs text-emerald-700">
        <Shield size={14} />
        <span>Seus dados estão protegidos conforme a política de privacidade institucional.</span>
      </div>
    </div>
  );
}
