/** Tipos do sistema de formulário dinâmico — Seções, Perguntas e Schema */

export type QuestionType = 'text' | 'textarea' | 'radio' | 'select' | 'checkbox' | 'date' | 'number' | 'matrix' | 'scale';

/**
 * Operador de comparação para condições.
 * - 'equals' (padrão): valor atual === valor esperado
 * - 'not_equals': valor atual !== valor esperado (útil para "diferente de")
 */
export type ConditionOperator = 'equals' | 'not_equals';

/** Condição que controla a exibição de uma pergunta (branching logic) */
export interface QuestionCondition {
  /** ID da pergunta pai */
  dependsOn: string;
  /** Valor(es) que ativam esta pergunta */
  value: string | string[];
  /** Operador de comparação. Padrão: 'equals' */
  operator?: ConditionOperator;
}

/** Linha de uma pergunta do tipo matriz (radio por linha) */
export interface MatrixRow {
  /** ID único da sub-pergunta (ex: 'q10_1_perfil_demografico') */
  id: string;
  /** Label da linha */
  label: string;
}

/** Uma pergunta individual dentro de uma seção */
export interface FormQuestion {
  id: string;
  type: QuestionType;
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  /** Linhas para tipo 'matrix' — cada linha renderiza um grupo de radio buttons Sim/Não */
  matrixRows?: MatrixRow[];
  condition?: QuestionCondition;
  /** Se true, quando esta pergunta estiver visível e NÃO respondida, bloqueia todas as perguntas seguintes */
  blocksFollowing?: boolean;
  /** Quantidade máxima da escala (tipo 'scale'). Padrão: 5 */
  scaleMax?: number;
  /**
   * Campo de texto vinculado — sempre visível, renderizado logo abaixo
   * da pergunta principal, dentro do mesmo container visual.
   * Não é condicional: aparece sempre que a pergunta-pai é visível.
   */
  linkedField?: {
    id: string;
    label: string;
    placeholder?: string;
    required?: boolean;
  };
}

/** Seção do formulário (agrupa perguntas visualmente) */
export interface FormSection {
  id: string;
  number: number;
  title: string;
  description?: string;
  questions: FormQuestion[];
}

/** Schema completo do formulário */
export interface FormSchema {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  sections: FormSection[];
}

/** Dados submetidos pelo usuário */
export interface FormData {
  [key: string]: string | string[] | undefined;
}
