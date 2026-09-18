import { useState, useCallback, useMemo } from 'react';
import DynamicForm from './components/DynamicForm';
import { formSchema } from './data/formSchema';
import { generatePdf } from './components/PdfExport';
import type { FormData } from './types/form';

function generateProtocol(): string {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `AP53-${datePart}-${randomPart}`;
}

export default function App() {
  const [pdfGenerating, setPdfGenerating] = useState(false);

  const protocolNumber = useMemo(() => generateProtocol(), []);
  const submissionDate = useMemo(() => new Date(), []);

  const handleGeneratePdf = useCallback(async (data: FormData) => {
    setPdfGenerating(true);
    try {
      await generatePdf({
        schema: formSchema,
        formData: data,
        protocolNumber,
        submissionDate,
      });
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
    } finally {
      setPdfGenerating(false);
    }
  }, [protocolNumber, submissionDate]);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 shadow-xl shadow-blue-900/20">
        <div className="mx-auto max-w-3xl px-5 py-6 sm:px-6 sm:py-8">
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-4 sm:gap-5">
            <img src="/logo-cap53.svg" alt="CAP 5.3" className="h-14 w-auto sm:h-11 shrink-0 drop-shadow-lg" />
            <div className="sm:border-l sm:border-blue-600/30 sm:pl-5 space-y-0.5">
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">{formSchema.title}</h1>
              <p className="text-xs sm:text-sm text-blue-200/70">{formSchema.subtitle}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay de geração do PDF */}
      {pdfGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="rounded-2xl bg-white p-8 shadow-2xl text-center space-y-4">
            <div className="h-12 w-12 mx-auto border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-slate-700">Gerando comprovante PDF...</p>
            <p className="text-xs text-slate-400">Aguarde um momento.</p>
          </div>
        </div>
      )}

      {/* Conteúdo principal */}
      <main className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">{formSchema.title}</h2>
          <p className="mt-1.5 text-sm text-slate-500">{formSchema.description}</p>
        </div>
        <DynamicForm schema={formSchema} onGeneratePdf={handleGeneratePdf} />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-6 text-center space-y-2">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Instituto Avalia AP53 &mdash; Todos os direitos reservados
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-300">
            <span className="inline-block h-px w-6 bg-slate-200" />
            <span>Desenvolvido por Fabio Ferreira de Oliveira — DAPS/CAP5.3</span>
            <span className="inline-block h-px w-6 bg-slate-200" />
          </div>
        </div>
      </footer>
    </div>
  );
}
