import type { FormSchema } from '../types/form';

/**
 * Schema declarativo do formulário de avaliação das UBS.
 * Adicione, remova ou reordene perguntas alterando apenas este arquivo.
 * O componente DynamicForm renderiza automaticamente com base nesta estrutura.
 */
export const formSchema: FormSchema = {
  id: 'avalia-ap53',
  title: 'Avaliação das Unidades Básicas de Saúde',
  subtitle: 'No contexto das RAS e do MACC',
  description:
    'Preencha os dados da unidade com atenção. Os campos marcados com * são obrigatórios.',

  sections: [
    // ──────────────────────────────────────────────────────────
    // SEÇÃO 1 — IDENTIFICAÇÃO
    // ──────────────────────────────────────────────────────────
    {
      id: 'identificacao',
      number: 1,
      title: 'Identificação',
      description: 'Dados de identificação da Unidade Básica de Saúde.',
      questions: [
        {
          id: 'q1',
          type: 'select',
          label: 'Nome da unidade',
          required: true,
          options: [
            'CF ALICE DE JESUS REGO',
            'CF DEOLINDO COUTO',
            'CF EDSON ABDALLA SAAD',
            'CF ERNANI DE PAIVA FERREIRA BRAGA',
            'CF HELANDE DE MELLO GONÇALVES',
            'CF ILZO MOTTA DE MELLO',
            'CF JAMIL HADDAD',
            'CF JOÃO BATISTA CHAGAS',
            'CF JOSÉ ANTÔNIO CIRAUDO',
            'CF LENICE MARIA MONTEIRO COELHO',
            'CF LOURENÇO DE MELLO',
            'CF SAMUEL PENHA VALLE',
            'CF SÉRGIO AROUCA',
            'CF VALÉRIA GOMES ESTEVES',
            'CF WALDEMAR BERARDINELLI',
            'CMS ADELINO SIMÕES',
            'CMS ALOYSIO AMÂNCIO DA SILVA',
            'CMS CATTAPRETA',
            'CMS CESÁRIO DE MELO',
            'CMS CYRO DE MELLO',
            'CMS DÉCIO AMARAL FILHO',
            'CMS EMYDIO CABRAL',
            'CMS FLORIPES GALDINO PEREIRA',
            'CMS MARIA APARECIDA DE ALMEIDA',
            'CMS SÁVIO ANTUNES',
          ],
        },
        {
          id: 'q2',
          type: 'text',
          label: 'Área Programática',
          placeholder: 'Ex: Área 01',
          required: true,
        },
        {
          id: 'q3',
          type: 'text',
          label: 'CNES',
          placeholder: 'Ex: 1234567',
          required: true,
        },
        {
          id: 'q4',
          type: 'text',
          label: 'Telefone para contato',
          placeholder: 'Ex: (11) 99999-0000',
          required: true,
        },
        {
          id: 'q5',
          type: 'text',
          label: 'Respondente',
          placeholder: 'Nome completo de quem responde',
          required: true,
        },
        {
          id: 'q6',
          type: 'text',
          label: 'Função',
          placeholder: 'Ex: Coordenador(a), Gerente, etc.',
          required: true,
        },
      ],
    },

    // ──────────────────────────────────────────────────────────
    // SEÇÃO 2 — TERRITORIALIZAÇÃO E CONHECIMENTO DA POPULAÇÃO
    // ──────────────────────────────────────────────────────────
    {
      id: 'territorializacao',
      number: 2,
      title: 'Territorialização e Conhecimento da População',
      description:
        'Avaliação do conhecimento territorial e das práticas de vigilância em saúde da população adscrita.',
      questions: [
        // Pergunta 7
        {
          id: 'q7',
          type: 'radio',
          label: 'A unidade possui território de abrangência formalmente definido?',
          options: ['Sim', 'Não'],
          required: true,
        },
        // Pergunta 8
        {
          id: 'q8',
          type: 'radio',
          label: 'A unidade possui mapa atualizado de seu território e respectivas microáreas?',
          options: ['Sim', 'Não'],
        },
        // Pergunta 9
        {
          id: 'q9',
          type: 'number',
          label: 'Qual o número estimado da população adscrita à unidade?',
          placeholder: 'Ex: 12000',
          required: true,
        },
        // Pergunta 10
        {
          id: 'q10',
          type: 'radio',
          label: 'A unidade dispõe de diagnóstico situacional atualizado do território?',
          options: ['Sim', 'Não'],
          required: true,
        },
        // ── PERGUNTA 10.1 — CONDICIONAL (aparece apenas se Q10 == "Sim") ──
        {
          id: 'q10_1',
          type: 'matrix',
          label: 'O diagnóstico situacional contempla:',
          required: true,
          condition: {
            dependsOn: 'q10',
            value: 'Sim',
          },
          matrixRows: [
            { id: 'q10_1_perfil_demografico', label: 'Perfil demográfico' },
            { id: 'q10_1_perfil_epidemiologico', label: 'Perfil epidemiológico' },
            { id: 'q10_1_condicoes_socioeconomicas', label: 'Condições socioeconômicas' },
            { id: 'q10_1_condicoes_ambientais', label: 'Condições ambientais' },
            { id: 'q10_1_vulnerabilidades_sociais', label: 'Vulnerabilidades sociais' },
            { id: 'q10_1_fatores_risco', label: 'Fatores de risco à saúde' },
          ],
        },
        // Pergunta 11
        {
          id: 'q11',
          type: 'radio',
          label: 'Com que frequência a unidade realiza a análise das necessidades de saúde do território?',
          options: ['Nunca', 'Mensalmente', 'Trimestralmente', 'Semestralmente', 'Anualmente', 'Outra'],
          required: true,
        },
        // ── 11.1 — CONDICIONAL: aparece se Q11 == "Outra" ──
        {
          id: 'q11_1',
          type: 'textarea',
          label: 'Descreva',
          placeholder: 'Descreva a frequência utilizada...',
          required: true,
          condition: { dependsOn: 'q11', value: 'Outra' },
        },
        // Pergunta 12
        {
          id: 'q12',
          type: 'textarea',
          label: 'Quais são os principais problemas de saúde identificados no território?',
          placeholder: 'Descreva os principais problemas...',
          required: true,
        },
        // Pergunta 13
        {
          id: 'q13',
          type: 'radio',
          label: 'Com que frequência a unidade identifica áreas ou grupos populacionais de maior vulnerabilidade?',
          options: ['Nunca', 'Mensalmente', 'Trimestralmente', 'Semestralmente', 'Anualmente', 'Outra'],
          required: true,
        },
        // Pergunta 14
        {
          id: 'q14',
          type: 'textarea',
          label: 'Quais são as principais dificuldades para manter o cadastro territorial atualizado?',
          placeholder: 'Descreva as principais dificuldades...',
          required: true,
        },
        // Pergunta 15
        {
          id: 'q15',
          type: 'textarea',
          label: 'Como as informações do território são utilizadas no planejamento das ações da unidade?',
          placeholder: 'Descreva como são utilizadas...',
          required: true,
        },
        // Pergunta 16
        {
          id: 'q16',
          type: 'radio',
          label: 'A unidade utiliza informações territoriais para definir prioridades assistenciais?',
          options: ['Sim', 'Não', 'Ocasionalmente'],
          required: true,
        },
        // Pergunta 17
        {
          id: 'q17',
          type: 'radio',
          label: 'A unidade possui cobertura por Agentes Comunitários de Saúde (ACS) em todo o território adscrito?',
          options: ['Sim', 'Não'],
          required: true,
        },
        // Pergunta 18
        {
          id: 'q18',
          type: 'radio',
          label: 'Todas as equipes possuem ACS vinculados?',
          options: ['Sim', 'Não'],
          required: true,
        },
        // Pergunta 19
        {
          id: 'q19',
          type: 'radio',
          label: 'Existe microárea formalmente definida para cada ACS?',
          options: ['Sim', 'Não'],
          required: true,
        },
        // Pergunta 20
        {
          id: 'q20',
          type: 'textarea',
          label: 'Quais dificuldades os ACS enfrentam para realizar visitas domiciliares?',
          placeholder: 'Descreva as dificuldades...',
          required: true,
        },
        // Pergunta 21
        {
          id: 'q21',
          type: 'radio',
          label: 'Os ACS utilizam dispositivos eletrônicos para o cadastro territorial?',
          options: ['Sim', 'Não', 'Às vezes'],
          required: true,
        },
        // Pergunta 22
        {
          id: 'q22',
          type: 'radio',
          label: 'Os ACS recebem capacitação para a utilização dos sistemas de informação?',
          options: ['Sim', 'Não', 'Às vezes'],
          required: true,
        },
        // Pergunta 23
        {
          id: 'q23',
          type: 'radio',
          label: 'A unidade utiliza os dados coletados pelos ACS para planejamento das ações de saúde?',
          options: ['Sempre', 'Frequentemente', 'Raramente', 'Nunca'],
          required: true,
        },
        // Pergunta 24
        {
          id: 'q24',
          type: 'textarea',
          label: 'De que forma as informações produzidas pelos ACS são utilizadas no planejamento das ações da unidade?',
          placeholder: 'Descreva a forma de utilização...',
          required: true,
        },
        // Pergunta 25
        {
          id: 'q25',
          type: 'radio',
          label: 'Os ACS participam das reuniões de equipe?',
          options: ['Sempre', 'Frequentemente', 'Ocasionalmente', 'Nunca'],
          required: true,
        },
      ],
    },

    // ──────────────────────────────────────────────────────────
    // SEÇÃO 3 — CADASTRO E IDENTIFICAÇÃO DE SUBPOPULAÇÕES
    // ──────────────────────────────────────────────────────────
    {
      id: 'cadastro_subpopulacoes',
      number: 3,
      title: 'Cadastro e Identificação de Subpopulações',
      description:
        'Avaliação das práticas de cadastro nominal e identificação de grupos prioritários no território.',
      questions: [
        // Pergunta 26
        {
          id: 'q26',
          type: 'number',
          label: 'Qual o número de usuários cadastrados na unidade?',
          placeholder: 'Ex: 8500',
          required: true,
        },
        // Pergunta 27
        {
          id: 'q27',
          type: 'number',
          label: 'Qual o número de usuários com cadastro ativo na unidade?',
          placeholder: 'Ex: 6200',
          required: true,
        },
        // Pergunta 28
        {
          id: 'q28',
          type: 'radio',
          label: 'Com que frequência o cadastro do usuário é atualizado?',
          options: ['Nunca', 'A cada visita', 'Quinzenalmente', 'Mensalmente', 'Semestralmente', 'Anualmente', 'Outra'],
          required: true,
        },
        // ── PERGUNTA 28.1 — CONDICIONAL: aparece se Q28 != "Nunca" ──
        {
          id: 'q28_1',
          type: 'text',
          label: 'Como ocorre essa atualização cadastral?',
          placeholder: 'Descreva o processo de atualização...',
          required: true,
          condition: {
            dependsOn: 'q28',
            value: 'Nunca',
            operator: 'not_equals',
          },
        },
        // Pergunta 29
        {
          id: 'q29',
          type: 'radio',
          label: 'A unidade monitora a proporção de cadastros desatualizados?',
          options: ['Sim', 'Não', 'Às vezes'],
          required: true,
        },
        // ── PERGUNTA 29.1 — CONDICIONAL: aparece se Q29 == "Sim" OU "Às vezes" ──
        {
          id: 'q29_1',
          type: 'text',
          label: 'Como esse monitoramento é feito?',
          placeholder: 'Descreva o método de monitoramento...',
          required: true,
          condition: {
            dependsOn: 'q29',
            value: ['Sim', 'Às vezes'],
          },
        },
        // Pergunta 30
        {
          id: 'q30',
          type: 'radio',
          label: 'A unidade identifica subpopulações prioritárias no território?',
          options: ['Sim', 'Não', 'Às vezes'],
        },
        // Pergunta 31 — Matriz de cadastro nominal por subpopulação
        {
          id: 'q31',
          type: 'matrix',
          label: 'A unidade mantém cadastro nominal atualizado dos seguintes grupos:',
          matrixRows: [
            { id: 'q32_gestantes', label: 'Gestantes' },
            { id: 'q32_puerperas', label: 'Puérperas' },
            { id: 'q32_criancas_2anos', label: 'Crianças menores de 2 anos' },
            { id: 'q32_hipertensos', label: 'Hipertensos' },
            { id: 'q32_diabeticos', label: 'Diabéticos' },
            { id: 'q32_idosos_fragis', label: 'Idosos frágeis' },
            { id: 'q32_pcd', label: 'Pessoas com deficiência' },
            { id: 'q32_transtornos_mentais', label: 'Pessoas com transtornos mentais graves' },
          ],
        },
        // Pergunta 32
        {
          id: 'q32',
          type: 'radio',
          label: 'A unidade utiliza o cadastro para busca ativa de usuários?',
          options: ['Sim', 'Não', 'Às vezes'],
        },
        // ── 32.1 — CONDICIONAL: aparece se Q32 == "Sim" OU "Às vezes" ──
        {
          id: 'q32_1',
          type: 'textarea',
          label: 'Como essa busca é feita?',
          placeholder: 'Descreva como é realizada a busca ativa de usuários...',
          required: true,
          condition: { dependsOn: 'q32', value: ['Sim', 'Às vezes'] },
        },
        // Pergunta 33
        {
          id: 'q33',
          type: 'textarea',
          label: 'Como são identificadas e atualizadas as subpopulações prioritárias?',
          placeholder: 'Descreva o processo de identificação e atualização...',
          required: true,
        },
      ],
    },

    // ──────────────────────────────────────────────────────────
    // SEÇÃO 4 — ACESSO DE PRIMEIRO CONTATO
    // ──────────────────────────────────────────────────────────
    {
      id: 'acesso_primeiro_contato',
      number: 4,
      title: 'Acesso de Primeiro Contato',
      description:
        'Avaliação das práticas de acolhimento, agendamento e classificação de risco na unidade.',
      questions: [
        // Pergunta 34
        {
          id: 'q34',
          type: 'radio',
          label: 'A unidade atua como principal porta de entrada dos usuários para a rede de saúde?',
          options: ['Sim', 'Não'],
          required: true,
        },
        // Pergunta 35
        {
          id: 'q35',
          type: 'textarea',
          label: 'Detalhe',
          placeholder: 'Descreva detalhes sobre o papel da unidade como porta de entrada...',
          required: true,
        },
        // Pergunta 36
        {
          id: 'q36',
          type: 'radio',
          label: 'Existe acolhimento da demanda espontânea durante todo o horário de funcionamento?',
          options: ['Sim', 'Não'],
          required: true,
        },
        // ── PERGUNTA 36.1 — CONDICIONAL: aparece se Q36 == "Sim" ──
        {
          id: 'q36_1',
          type: 'textarea',
          label: 'Descreva',
          placeholder: 'Descreva como funciona o acolhimento da demanda espontânea...',
          required: true,
          condition: {
            dependsOn: 'q36',
            value: 'Sim',
          },
        },
        // Pergunta 37
        {
          id: 'q37',
          type: 'radio',
          label: 'O usuário pode agendar consultas sem necessidade de comparecimento prévio à unidade?',
          options: ['Sim', 'Não'],
          required: true,
        },
        // ── PERGUNTA 37.1 — CONDICIONAL: aparece se Q37 == "Sim" ──
        {
          id: 'q37_1',
          type: 'textarea',
          label: 'Descreva',
          placeholder: 'Descreva como funciona o agendamento...',
          required: true,
          condition: {
            dependsOn: 'q37',
            value: 'Sim',
          },
        },
        // Pergunta 38
        {
          id: 'q38',
          type: 'radio',
          label: 'Existem critérios formalizados para classificação e priorização dos atendimentos?',
          options: ['Sim', 'Não'],
          required: true,
        },
        // ── PERGUNTA 38.1 — CONDICIONAL: aparece se Q38 == "Sim" ──
        {
          id: 'q38_1',
          type: 'textarea',
          label: 'Descreva',
          placeholder: 'Descreva os critérios de classificação e priorização...',
          required: true,
          condition: {
            dependsOn: 'q38',
            value: 'Sim',
          },
        },
        // Pergunta 39
        {
          id: 'q39',
          type: 'number',
          label: 'Qual o tempo médio (em dias) para consulta médica programada?',
          placeholder: 'Ex: 15',
          required: true,
        },
        // Pergunta 40
        {
          id: 'q40',
          type: 'number',
          label: 'Qual o tempo médio (em dias) para consulta de enfermagem programada?',
          placeholder: 'Ex: 7',
          required: true,
        },
        // Pergunta 41
        {
          id: 'q41',
          type: 'textarea',
          label: 'Quais são as principais dificuldades relacionadas ao acesso dos usuários?',
          placeholder: 'Descreva as principais dificuldades...',
          required: true,
        },
      ],
    },

    // ──────────────────────────────────────────────────────────
    // SEÇÃO 5 — ESTRATIFICAÇÃO DE RISCO
    // ──────────────────────────────────────────────────────────
    {
      id: 'estratificacao_risco',
      number: 5,
      title: 'Estratificação de Risco',
      description:
        'Avaliação das práticas de estratificação de risco para pessoas com condições crônicas.',
      questions: [
        // Pergunta 42
        {
          id: 'q42',
          type: 'radio',
          label: 'A unidade realiza estratificação de risco para pessoas com condições crônicas?',
          options: ['Sim', 'Não', 'Às vezes'],
          required: true,
        },
        // ── 42.1 — CONDICIONAL: aparece se Q42 == "Sim" OU "Às vezes" ──
        {
          id: 'q42_1',
          type: 'textarea',
          label: 'Descreva',
          placeholder: 'Descreva como é feita a estratificação de risco...',
          required: true,
        },
        // Pergunta 43
        {
          id: 'q43',
          type: 'radio',
          label: 'A estratificação segue protocolo institucional formalizado?',
          options: ['Sim', 'Não', 'Às vezes'],
          required: true,
        },
        // ── 43.1 — CONDICIONAL: aparece se Q43 == "Sim" OU "Às vezes" ──
        {
          id: 'q43_1',
          type: 'textarea',
          label: 'Descreva',
          placeholder: 'Descreva o protocolo institucional utilizado...',
          required: true,
          condition: { dependsOn: 'q43', value: ['Sim', 'Não', 'Às vezes'] },
        },
        // Pergunta 44
        {
          id: 'q44',
          type: 'radio',
          label: 'A estratificação é registrada em sistema informatizado?',
          options: ['Sim', 'Não', 'Às vezes'],
          required: true,
        },
        // ── 44.1 — CONDICIONAL: aparece se Q44 == "Sim" OU "Às vezes" ──
        {
          id: 'q44_1',
          type: 'textarea',
          label: 'Descreva',
          placeholder: 'Descreva o sistema utilizado e o processo de registro...',
          required: true,
          condition: { dependsOn: 'q44', value: ['Sim', 'Não', 'Às vezes'] },
        },
        // Pergunta 45
        {
          id: 'q45',
          type: 'textarea',
          label: 'Quais condições são submetidas à estratificação de risco?',
          placeholder: 'Ex: Hipertensão, Diabetes, DPOC, Insuficiência Cardíaca...',
          required: true,
        },
        // Pergunta 46
        {
          id: 'q46',
          type: 'radio',
          label: 'A unidade consegue informar o quantitativo de usuários por estrato de risco?',
          options: ['Sim', 'Não'],
          required: true,
        },
        // Pergunta 47
        {
          id: 'q47',
          type: 'radio',
          label: 'A frequência de acompanhamento varia conforme o estrato de risco?',
          options: ['Sim', 'Não'],
          required: true,
        },
        // Pergunta 48
        {
          id: 'q48',
          type: 'radio',
          label: 'Há plano de cuidado diferenciado para usuários de alto risco?',
          options: ['Sim', 'Não'],
          required: true,
        },
        // ── 48.1 — CONDICIONAL: aparece se Q48 == "Sim" ──
        {
          id: 'q48_1',
          type: 'textarea',
          label: 'Descreva',
          placeholder: 'Descreva o plano de cuidado diferenciado...',
          required: true,
          condition: { dependsOn: 'q48', value: 'Sim' },
        },
        // Pergunta 49
        {
          id: 'q49',
          type: 'radio',
          label: 'Os usuários de alto risco recebem monitoramento específico?',
          options: ['Sim', 'Não', 'Às vezes'],
          required: true,
        },
        // ── 49.1 — CONDICIONAL: aparece se Q49 == "Sim" OU "Às vezes" ──
        {
          id: 'q49_1',
          type: 'textarea',
          label: 'Descreva',
          placeholder: 'Descreva o tipo de monitoramento realizado...',
          required: true,
          condition: { dependsOn: 'q49', value: ['Sim', 'Às vezes'] },
        },
        // Pergunta 50
        {
          id: 'q50',
          type: 'radio',
          label: 'Com que frequência a estratificação é revisada?',
          options: ['Semestralmente', 'Anualmente', 'Conforme necessidade clínica', 'Não há revisão periódica', 'Outra'],
          required: true,
        },
        // ── 50.1 — CONDICIONAL: aparece se Q50 == "Outra" ──
        {
          id: 'q50_1',
          type: 'textarea',
          label: 'Descreva',
          placeholder: 'Descreva a frequência utilizada...',
          required: true,
          condition: { dependsOn: 'q50', value: ['Semestralmente', 'Anualmente', 'Conforme necessidade clínica', 'Não há revisão periódica', 'Outra'] },
        },
        // Pergunta 51
        {
          id: 'q51',
          type: 'textarea',
          label: 'Descreva como a estratificação é utilizada no planejamento assistencial.',
          placeholder: 'Descreva a utilização no planejamento...',
          required: true,
        },
      ],
    },

    // ──────────────────────────────────────────────────────────
    // SEÇÃO 6 — COORDENAÇÃO DO CUIDADO E INTEGRAÇÃO DA REDE
    // ──────────────────────────────────────────────────────────
    {
      id: 'coordenacao_cuidado',
      number: 6,
      title: 'Coordenação do Cuidado e Integração da Rede',
      description:
        'Avaliação das práticas de acompanhamento, referência/contrarreferência e integração com a rede de saúde.',
      questions: [
        // Pergunta 52
        {
          id: 'q52',
          type: 'radio',
          label: 'A unidade acompanha os usuários encaminhados para outros pontos da rede?',
          options: ['Sim', 'Não', 'Às vezes'],
          required: true,
        },
        // ── 52.1 — CONDICIONAL: aparece se Q52 == "Sim" OU "Às vezes" ──
        {
          id: 'q52_1',
          type: 'textarea',
          label: 'Descreva',
          placeholder: 'Descreva como é feito o acompanhamento dos usuários encaminhados...',
          required: true,
          condition: { dependsOn: 'q52', value: ['Sim', 'Às vezes'] },
        },
        // Pergunta 53
        {
          id: 'q53',
          type: 'radio',
          label: 'Existe fluxo formal de referência e contrarreferência?',
          options: ['Sim', 'Não'],
          required: true,
        },
        // ── 53.1 — CONDICIONAL: aparece se Q53 == "Sim" ──
        {
          id: 'q53_1',
          type: 'textarea',
          label: 'Descreva',
          placeholder: 'Descreva o fluxo de referência e contrarreferência...',
          required: true,
          condition: { dependsOn: 'q53', value: 'Sim' },
        },
        // Pergunta 54
        {
          id: 'q54',
          type: 'radio',
          label: 'A unidade recebe regularmente informações dos serviços especializados sobre os usuários encaminhados?',
          options: ['Sempre', 'Frequentemente', 'Ocasionalmente', 'Nunca'],
          required: true,
        },
        // Pergunta 55
        {
          id: 'q55',
          type: 'textarea',
          label: 'Como essa comunicação é feita?',
          placeholder: 'Descreva os canais e processos de comunicação...',
          required: true,
        },
        // Pergunta 56
        {
          id: 'q56',
          type: 'textarea',
          label: 'Como é realizado o acompanhamento dos usuários encaminhados para outros serviços?',
          placeholder: 'Descreva o processo de acompanhamento...',
          required: true,
        },
        // Pergunta 57
        {
          id: 'q57',
          type: 'radio',
          label: 'A equipe realiza discussão periódica de casos complexos?',
          options: ['Sim', 'Não'],
          required: true,
        },
        // Pergunta 58
        {
          id: 'q58',
          type: 'radio',
          label: 'Existem profissionais responsáveis pelo monitoramento de usuários de maior risco?',
          options: ['Sim', 'Não', 'Às vezes'],
          required: true,
        },
        // ── 58.1 — CONDICIONAL: aparece se Q58 == "Sim" OU "Às vezes" ──
        {
          id: 'q58_1',
          type: 'textarea',
          label: 'Descreva',
          placeholder: 'Descreva os profissionais e o processo de monitoramento...',
          required: true,
          condition: { dependsOn: 'q58', value: ['Sim', 'Às vezes'] },
        },
      ],
    },

    // ──────────────────────────────────────────────────────────
    // SEÇÃO 7 — PLANEJAMENTO E GESTÃO CLÍNICA
    // ──────────────────────────────────────────────────────────
    {
      id: 'planejamento_gestao',
      number: 7,
      title: 'Planejamento e Gestão Clínica',
      description:
        'Avaliação das práticas de planejamento assistencial, monitoramento de indicadores e uso de listas nominais.',
      questions: [
        // ── Pergunta 59 (BLOCO 1) ──
        {
          id: 'q59',
          type: 'radio',
          label: 'As equipes utilizam listas nominais para identificação de pacientes em atraso de acompanhamento?',
          options: ['Sim', 'Não'],
          required: true,
        },
        // Pergunta 60 (BLOCO 2) — sempre visível
        {
          id: 'q60',
          type: 'textarea',
          label: 'Descreva',
          placeholder: 'Descreva como são utilizadas as listas nominais...',
          required: true,
        },
        // ── Pergunta 61 (BLOCO 3) ──
        {
          id: 'q61',
          type: 'radio',
          label: 'São realizadas ações busca ativa para pacientes faltosos?',
          options: ['Sim', 'Não', 'Às vezes'],
          required: true,
        },
        // ── 61.1 — CONDICIONAL: aparece se Q61 == "Sim" OU "Às vezes" ──
        {
          id: 'q61_1',
          type: 'textarea',
          label: 'Descreva',
          placeholder: 'Descreva as ações de busca ativa realizadas...',
          required: true,
          condition: { dependsOn: 'q61', value: ['Sim', 'Às vezes'] },
        },
        // ── Pergunta 62 (BLOCO 5) ──
        {
          id: 'q62',
          type: 'radio',
          label: 'A unidade estabelece metas específicas para grupos prioritários?',
          options: ['Sim', 'Não'],
          required: true,
        },
        // ── 62.1 — CONDICIONAL: aparece se Q62 == "Sim" ──
        {
          id: 'q62_1',
          type: 'textarea',
          label: 'Descreva',
          placeholder: 'Descreva as metas estabelecidas para os grupos prioritários...',
          required: true,
          condition: { dependsOn: 'q62', value: 'Sim' },
        },
        // ── Pergunta 63 (BLOCO 7) ──
        {
          id: 'q63',
          type: 'radio',
          label: 'A unidade monitora indicadores assistenciais regularmente?',
          options: ['Sim', 'Não'],
          required: true,
        },
        // ── 63.1 — CONDICIONAL: aparece se Q63 == "Sim" ──
        {
          id: 'q63_1',
          type: 'textarea',
          label: 'Quais indicadores são monitorados regularmente?',
          placeholder: 'Ex: Taxa de pré-natal, cobertura vacinal, hipertensão controlada...',
          required: true,
          condition: { dependsOn: 'q63', value: 'Sim' },
        },
        // ── Pergunta 64 (BLOCO 9) ──
        {
          id: 'q64',
          type: 'radio',
          label: 'Com que frequência a unidade realiza reuniões para análise de indicadores e resultados?',
          options: ['Nunca', 'Semanalmente', 'Quinzenalmente', 'Mensalmente', 'Trimestralmente', 'Semestralmente', 'Outra'],
          required: true,
        },
        // Pergunta 65 (BLOCO 10) — incondicional (sempre visível)
        {
          id: 'q65',
          type: 'textarea',
          label: 'Descreva',
          placeholder: 'Descreva o processo de análise e discussão de indicadores...',
          required: true,
        },
        // Pergunta 66 (BLOCO 11) — sempre visível
        {
          id: 'q66',
          type: 'textarea',
          label: 'Como os dados assistenciais são utilizados para o planejamento das ações da unidade?',
          placeholder: 'Descreva a utilização dos dados no planejamento...',
          required: true,
        },
      ],
    },

    // ──────────────────────────────────────────────────────────
    // SEÇÃO 8 — ATENÇÃO ÀS CONDIÇÕES CRÔNICAS
    // ──────────────────────────────────────────────────────────
    {
      id: 'condicoes_cronicas',
      number: 8,
      title: 'Atenção às Condições Crônicas',
      description:
        'Avaliação das práticas de monitoramento, acompanhamento e gestão de doenças crônicas.',
      questions: [
        // Pergunta 67
        {
          id: 'q67',
          type: 'radio',
          label: 'A unidade possui protocolos clínicos formalizados para condições crônicas prioritárias?',
          options: ['Sim', 'Não'],
          required: true,
        },
        // 67.1 — sempre visível
        {
          id: 'q67_1',
          type: 'textarea',
          label: 'Descreva',
          placeholder: 'Descreva os protocolos clínicos adotados...',
          required: true,
        },
        // Pergunta 68
        {
          id: 'q68',
          type: 'radio',
          label: 'Os usuários com maior risco clínico recebem acompanhamento diferenciado?',
          options: ['Sim', 'Não', 'Às vezes'],
          required: true,
        },
        // ── 68.1 — CONDICIONAL: aparece se Q68 == "Sim" OU "Às vezes" ──
        {
          id: 'q68_1',
          type: 'textarea',
          label: 'Descreva',
          placeholder: 'Descreva o acompanhamento diferenciado...',
          required: true,
          condition: { dependsOn: 'q68', value: ['Sim', 'Às vezes'] },
        },
        // Pergunta 69
        {
          id: 'q69',
          type: 'radio',
          label: 'A unidade desenvolve ações de autocuidado apoiado?',
          options: ['Sim', 'Não', 'Às vezes'],
          required: true,
        },
        // ── 69.1 — CONDICIONAL: aparece se Q69 == "Sim" OU "Às vezes" ──
        {
          id: 'q69_1',
          type: 'textarea',
          label: 'Descreva',
          placeholder: 'Descreva as ações de autocuidado apoiado...',
          required: true,
          condition: { dependsOn: 'q69', value: ['Sim', 'Às vezes'] },
        },
        // Pergunta 70
        {
          id: 'q70',
          type: 'radio',
          label: 'Há monitoramento sistemático dos pacientes com condições crônicas?',
          options: ['Sim', 'Não'],
          required: true,
        },
        // ── 70.1 — CONDICIONAL: aparece se Q70 == "Sim" ──
        {
          id: 'q70_1',
          type: 'textarea',
          label: 'Descreva',
          placeholder: 'Descreva o processo de monitoramento sistemático...',
          required: true,
          condition: { dependsOn: 'q70', value: 'Sim' },
        },
        // Pergunta 71 — sempre visível
        {
          id: 'q71',
          type: 'textarea',
          label: 'Descreva as principais estratégias adotadas para gestão das condições crônicas.',
          placeholder: 'Descreva as estratégias utilizadas...',
          required: true,
        },
        // Pergunta 72 — matriz com sub-itens A e B
        {
          id: 'q72',
          type: 'matrix',
          label: 'Existe acompanhamento programado para pessoas com:',
          matrixRows: [
            { id: 'q81_hipertensao', label: 'Hipertensão arterial' },
            { id: 'q81_diabetes', label: 'Diabetes mellitus' },
          ],
        },
      ],
    },

    // ──────────────────────────────────────────────────────────
    // SEÇÃO 9 — REDE DE ATENÇÃO MATERNO-INFANTIL
    // ──────────────────────────────────────────────────────────
    {
      id: 'rede_materno_infantil',
      number: 9,
      title: 'Rede de Atenção Materno-Infantil',
      description:
        'Avaliação das práticas de acompanhamento materno-infantil, busca ativa de gestantes e integração com a rede.',
      questions: [
        // Pergunta 73 — Maternidade de referência
        {
          id: 'q73',
          type: 'select',
          label: 'Qual a maternidade de referência da unidade?',
          options: [
            'SMS HOSPITAL MATERNIDADE FERNANDO MAGALHAES AP 10',
            'SMS HOSPITAL MATERNIDADE MARIA AMELIA B DE HOLLANDA AP 10',
            'SMS HOSPITAL MUNICIPAL MIGUEL COUTO AP 21',
            'SMS MATERNIDADE DA ROCINHA AP 21',
            'SMS HOSPITAL MATERNIDADE PAULINO WERNECK AP 31',
            'SMS HOSPITAL MATERNIDADE CARMELA DUTRA AP 32',
            'SMS HOSPITAL MATERNIDADE ALEXANDER FLEMING AP 33',
            'SMS HOSPITAL MATERNIDADE HERCULANO PINHEIRO AP 33',
            'SMS MATERNIDADE LEILA DINIZ AP 40',
            'SMS HOSPITAL MUNICIPAL ALBERT SCHWEITZER AP 51',
            'SMS MATERNIDADE DA MULHER MARISKA RIBEIRO AP 51',
            'SMS HOSPITAL MUNICIPAL ROCHA FARIA AP 52',
            'SMS HOSPITAL MUNICIPAL PEDRO II AP 53',
            'Outra',
          ],
          required: true,
        },
        // ── 73.1 — CONDICIONAL: aparece se Q73 == "Outra" (not_equals para os demais) ──
        {
          id: 'q73_1',
          type: 'text',
          label: 'Informe',
          placeholder: 'Informe o nome da maternidade de referência...',
          required: true,
          condition: { dependsOn: 'q73', value: 'Outra' },
        },
        // Pergunta 74
        {
          id: 'q74',
          type: 'radio',
          label: 'Com que frequência os ACS realizam busca ativa de gestantes?',
          options: ['Nunca', 'Diariamente', 'Semanalmente', 'Quinzenalmente', 'Mensalmente', 'Outra'],
          required: true,
        },
        // Pergunta 75
        {
          id: 'q75',
          type: 'textarea',
          label: 'Como os ACS contribuem para a identificação precoce das gestantes no território?',
          placeholder: 'Descreva a forma de identificação precoce...',
          required: true,
        },
        // Pergunta 76
        {
          id: 'q76',
          type: 'radio',
          label: 'Todas as gestantes cadastradas estão vinculadas a uma maternidade de referência?',
          options: ['Sim', 'Não', 'Às vezes'],
          required: true,
        },
        // Pergunta 77
        {
          id: 'q77',
          type: 'radio',
          label: 'A unidade mantém lista nominal atualizada das gestantes acompanhadas?',
          options: ['Sim', 'Não'],
          required: true,
        },
        // Pergunta 78
        {
          id: 'q78',
          type: 'radio',
          label: 'Existe monitoramento das faltas às consultas de pré-natal?',
          options: ['Sim', 'Não', 'Às vezes'],
          required: true,
        },
        // Pergunta 79
        {
          id: 'q79',
          type: 'radio',
          label: 'Há busca ativa de gestantes faltosas?',
          options: ['Sim', 'Não', 'Às vezes'],
          required: true,
        },
        // Pergunta 80
        {
          id: 'q80',
          type: 'radio',
          label: 'Com que frequência os ACS realizam busca ativa de gestantes com pré-natal interrompido?',
          options: ['Nunca', 'Diariamente', 'Semanalmente', 'Quinzenalmente', 'Mensalmente', 'Outra'],
          required: true,
        },
        // Pergunta 81
        {
          id: 'q81',
          type: 'textarea',
          label: 'Como ocorre o acompanhamento de gestantes faltosas ou que abandonam o pré-natal?',
          placeholder: 'Descreva o processo de acompanhamento...',
          required: true,
        },
        // Pergunta 82
        {
          id: 'q82',
          type: 'radio',
          label: 'A unidade acompanha a realização dos exames preconizados para o pré-natal?',
          options: ['Sim', 'Não', 'Às vezes'],
          required: true,
        },
        // Pergunta 83
        {
          id: 'q83',
          type: 'radio',
          label: 'Existe processo de estratificação de risco das gestantes cadastradas no território?',
          options: ['Sim', 'Não', 'Às vezes'],
          required: true,
        },
        // ── 83.1 — CONDICIONAL: aparece se Q83 == "Sim" OU "Às vezes" ──
        {
          id: 'q83_1',
          type: 'textarea',
          label: 'Descreva',
          placeholder: 'Descreva o processo de estratificação de risco...',
          required: true,
          condition: { dependsOn: 'q83', value: ['Sim', 'Às vezes'] },
        },
        // Pergunta 84
        {
          id: 'q84',
          type: 'radio',
          label: 'Os ACS participam da identificação de gestantes de risco?',
          options: ['Sempre', 'Frequentemente', 'Ocasionalmente', 'Nunca'],
          required: true,
        },
        // Pergunta 85
        {
          id: 'q85',
          type: 'radio',
          label: 'Os ACS recebem capacitação sobre estratificação de riscos?',
          options: ['Sim', 'Não', 'Às vezes'],
          required: true,
        },
        // Pergunta 86
        {
          id: 'q86',
          type: 'radio',
          label: 'Existe fluxo formal para encaminhamento de gestantes de alto risco?',
          options: ['Sim', 'Não'],
          required: true,
        },
        // Pergunta 87
        {
          id: 'q87',
          type: 'radio',
          label: 'Há retorno de informações da maternidade para a unidade após o parto?',
          options: ['Sim', 'Não', 'Às vezes'],
          required: true,
        },
        // Pergunta 88
        {
          id: 'q88',
          type: 'radio',
          label: 'A unidade acompanha a puérpera e o recém-nascido após a alta hospitalar?',
          options: ['Sim', 'Não', 'Às vezes'],
          required: true,
        },
        // Pergunta 89
        {
          id: 'q89',
          type: 'textarea',
          label: 'Como ocorre o acompanhamento de recém-nascidos e crianças de risco no território?',
          placeholder: 'Descreva o processo de acompanhamento...',
          required: true,
        },
        // Pergunta 90
        {
          id: 'q90',
          type: 'radio',
          label: 'Com que frequência os ACS realizam busca ativa de crianças faltosas às consultas de puericultura?',
          options: ['Nunca', 'Diariamente', 'Semanalmente', 'Quinzenalmente', 'Mensalmente', 'Outra'],
          required: true,
        },
        // ── 90.1 — CONDICIONAL: aparece se Q90 != "Nunca" ──
        {
          id: 'q90_1',
          type: 'textarea',
          label: 'Descreva',
          placeholder: 'Descreva como é realizada a busca ativa de crianças faltosas...',
          required: true,
          condition: { dependsOn: 'q90', value: 'Nunca', operator: 'not_equals' },
        },
        // Pergunta 91
        {
          id: 'q91',
          type: 'textarea',
          label: 'Como ocorre a comunicação entre a unidade e os demais serviços da Rede Materno-Infantil?',
          placeholder: 'Descreva os canais de comunicação...',
          required: true,
        },
        // Pergunta 92
        {
          id: 'q92',
          type: 'radio',
          label: 'Os ACS recebem capacitação periódica para atuação na saúde materno-infantil?',
          options: ['Sim', 'Não', 'Às vezes'],
          required: true,
        },
        // ── 92.1 — CONDICIONAL: aparece se Q92 == "Sim" OU "Às vezes" ──
        {
          id: 'q92_1',
          type: 'textarea',
          label: 'Descreva',
          placeholder: 'Descreva as capacitações recebidas...',
          required: true,
          condition: { dependsOn: 'q92', value: ['Sim', 'Às vezes'] },
        },
        // Pergunta 93
        {
          id: 'q93',
          type: 'textarea',
          label: 'Quais melhorias poderiam fortalecer a atuação dos ACS na coordenação do cuidado materno-infantil?',
          placeholder: 'Descreva possíveis melhorias...',
          required: true,
        },
        // Pergunta 94
        {
          id: 'q94',
          type: 'select',
          label: 'Qual o percentual estimado do território adscrito à UBS coberto por Agentes Comunitários de Saúde (ACS)?',
          options: ['0% a 30%', '31% a 50%', '51% a 60%', '61% a 70%', '71% a 80%', '81% a 100%'],
          required: true,
        },
      ],
    },

    // ──────────────────────────────────────────────────────────
    // SEÇÃO 10 — GOVERNANÇA, APOIO INSTITUCIONAL E MONITORAMENTO
    // PELO NÍVEL CENTRAL
    // ──────────────────────────────────────────────────────────
    {
      id: 'governanca_monitoramento',
      number: 10,
      title: 'Governança, Apoio Institucional e Monitoramento pelo Nível Central',
      description:
        'Avaliação da relação entre o nível central e a unidade em termos de metas, monitoramento, devolutiva e apoio institucional.',
      questions: [
        // Pergunta 95
        {
          id: 'q95',
          type: 'radio',
          label: 'O nível central estabelece metas assistenciais para a unidade?',
          options: ['Sim', 'Não', 'Às vezes'],
          required: true,
        },
        // ── 95.1 — CONDICIONAL: aparece se Q95 == "Sim" OU "Às vezes" ──
        {
          id: 'q95_1',
          type: 'textarea',
          label: 'Descreva',
          placeholder: 'Descreva as metas assistenciais estabelecidas pelo nível central...',
          required: true,
          condition: { dependsOn: 'q95', value: ['Sim', 'Não', 'Às vezes'] },
        },
        // Pergunta 96
        {
          id: 'q96',
          type: 'radio',
          label: 'As metas são formalmente pactuadas com a equipe local?',
          options: ['Sim', 'Não', 'Às vezes'],
          required: true,
        },
        // ── 96.1 — CONDICIONAL: aparece se Q96 == "Sim" OU "Às vezes" ──
        {
          id: 'q96_1',
          type: 'textarea',
          label: 'Descreva',
          placeholder: 'Descreva como ocorre a pactuação das metas com a equipe local...',
          required: true,
          condition: { dependsOn: 'q96', value: ['Sim', 'Não', 'Às vezes'] },
        },
        // Pergunta 97
        {
          id: 'q97',
          type: 'radio',
          label: 'O cumprimento das metas é monitorado periodicamente?',
          options: ['Sim', 'Não', 'Às vezes'],
          required: true,
        },
        // Pergunta 98
        {
          id: 'q98',
          type: 'radio',
          label: 'A unidade recebe devolutiva sobre o cumprimento das metas?',
          options: ['Sim', 'Não', 'Às vezes'],
          required: true,
        },
        // ── 98.1 — CONDICIONAL: aparece se Q98 == "Sim" OU "Às vezes" ──
        {
          id: 'q98_1',
          type: 'textarea',
          label: 'Como ocorre a devolutiva dos resultados para a equipe da unidade?',
          placeholder: 'Descreva o processo de devolutiva...',
          required: true,
          condition: { dependsOn: 'q98', value: ['Sim', 'Às vezes'] },
        },
        // Pergunta 99
        {
          id: 'q99',
          type: 'radio',
          label: 'O nível central realiza reuniões periódicas para análise de resultados com a equipe da unidade?',
          options: ['Sim', 'Não', 'Às vezes'],
          required: true,
        },
        // ── 99.1 — CONDICIONAL: aparece se Q99 == "Sim" OU "Às vezes" ──
        {
          id: 'q99_1',
          type: 'textarea',
          label: 'Descreva',
          placeholder: 'Descreva as reuniões periódicas realizadas...',
          required: true,
          condition: { dependsOn: 'q99', value: ['Sim', 'Às vezes'] },
        },
        // Pergunta 100
        {
          id: 'q100',
          type: 'radio',
          label: 'A unidade recebe regularmente informações sobre seu desempenho assistencial?',
          options: ['Sim', 'Não', 'Às vezes'],
          required: true,
        },
        // Pergunta 101
        {
          id: 'q101',
          type: 'radio',
          label: 'A unidade recebe apoio institucional para melhoria dos indicadores?',
          options: ['Sim', 'Não', 'Às vezes'],
          required: true,
        },
        // ── 101.1 — CONDICIONAL: aparece se Q101 == "Sim" OU "Às vezes" ──
        {
          id: 'q101_1',
          type: 'textarea',
          label: 'Descreva',
          placeholder: 'Descreva o tipo de apoio institucional recebido...',
          required: true,
          condition: { dependsOn: 'q101', value: ['Sim', 'Às vezes'] },
        },
        // Pergunta 102 — Apoio do Nível Central e Indicadores
        {
          id: 'q102',
          type: 'radio',
          label: 'O nível central utiliza os resultados dos indicadores para redefinir prioridades e apoiar a organização da assistência?',
          options: ['Sim', 'Não', 'Às vezes'],
          required: true,
        },
        // ── 102.1 — CONDICIONAL: aparece se Q102 == "Sim" OU "Às vezes" ──
        {
          id: 'q102_1',
          type: 'textarea',
          label: 'Descreva',
          placeholder: 'Descreva como os resultados dos indicadores são utilizados...',
          required: true,
          condition: { dependsOn: 'q102', value: ['Sim', 'Às vezes'] },
        },
        // Pergunta 103
        {
          id: 'q103',
          type: 'radio',
          label: 'Existe painel de indicadores disponibilizado à unidade?',
          options: ['Sim', 'Não'],
          required: false,
        },
        // Pergunta 104
        {
          id: 'q104',
          type: 'textarea',
          label: 'Quais indicadores são mais frequentemente acompanhados pelo nível central?',
          placeholder: 'Descreva os indicadores acompanhados...',
          required: true,
        },
        // Pergunta 105
        {
          id: 'q105',
          type: 'radio',
          label: 'O nível central apoia a implementação de protocolos clínicos?',
          options: ['Sim', 'Não'],
          required: false,
        },
        // Pergunta 106
        {
          id: 'q106',
          type: 'textarea',
          label: 'Descreva',
          placeholder: 'Descreva o apoio na implementação de protocolos clínicos...',
          required: true,
        },
        // Pergunta 107
        {
          id: 'q107',
          type: 'radio',
          label: 'O nível central apoia a estratificação de risco e a gestão de casos complexos?',
          options: ['Sim', 'Não'],
          required: true,
        },
        // Pergunta 108
        {
          id: 'q108',
          type: 'textarea',
          label: 'Descreva',
          placeholder: 'Descreva o apoio na estratificação de risco e gestão de casos complexos...',
          required: true,
        },
        // Pergunta 109
        {
          id: 'q109',
          type: 'radio',
          label: 'O nível central promove ações de educação permanente para as equipes?',
          options: ['Sim', 'Não'],
          required: true,
        },
        // ── 109.1 — CONDICIONAL: aparece se Q109 == "Sim" ──
        {
          id: 'q109_1',
          type: 'textarea',
          label: 'Que tipos de capacitação ou educação permanente são promovidos para a equipe?',
          placeholder: 'Descreva as capacitações e ações de educação permanente...',
          required: true,
          condition: { dependsOn: 'q109', value: 'Sim' },
        },
        // Pergunta 110
        {
          id: 'q110',
          type: 'textarea',
          label: 'Quais formas de apoio institucional são oferecidas pelo nível central?',
          placeholder: 'Descreva as formas de apoio institucional...',
          required: true,
        },
        // Pergunta 111
        {
          id: 'q111',
          type: 'textarea',
          label: 'Na percepção da equipe, quais aspectos do apoio do nível central poderiam ser aprimorados?',
          placeholder: 'Descreva os aspectos que poderiam ser aprimorados...',
          required: true,
        },
      ],
    },

    // ──────────────────────────────────────────────────────────
    // SEÇÃO 11 — AVALIAÇÃO GERAL
    // ──────────────────────────────────────────────────────────
    {
      id: 'avaliacao_geral',
      number: 11,
      title: 'Avaliação Geral',
      description:
        'Considerações finais da equipe sobre o funcionamento da unidade e da rede de atenção à saúde.',
      questions: [
        // Pergunta 112 — sempre visível
        {
          id: 'q112',
          type: 'textarea',
          label: 'Quais são as principais fortalezas da unidade na coordenação do cuidado da população adscrita?',
          placeholder: 'Descreva as principais fortalezas...',
          required: true,
        },
        // Pergunta 113 — sempre visível
        {
          id: 'q113',
          type: 'textarea',
          label: 'Quais são as principais dificuldades para atuação da unidade como coordenadora da Rede de Atenção à Saúde?',
          placeholder: 'Descreva as principais dificuldades...',
          required: true,
        },
        // Pergunta 114 — sempre visível
        {
          id: 'q114',
          type: 'textarea',
          label: 'Quais melhorias a equipe considera prioritárias para aprimorar o funcionamento da rede?',
          placeholder: 'Descreva as melhorias prioritárias...',
          required: true,
        },
        // Pergunta 115 — Escala 1-5 + linkedField
        {
          id: 'q115',
          type: 'scale',
          label: 'Avalie (1 a 5) o tempo adequado para atendimento de pacientes em relação a consultas com médicos especialistas.',
          required: true,
          scaleMax: 5,
          linkedField: {
            id: 'q115_lf',
            label: 'Esclareça sua nota.',
            placeholder: 'Justifique a nota atribuída...',
            required: true,
          },
        },
        // Pergunta 116 — Escala 1-5 + linkedField
        {
          id: 'q116',
          type: 'scale',
          label: 'Avalie (1 a 5) o tempo adequado para atendimento de pacientes em relação a realização de exames médicos.',
          required: true,
          scaleMax: 5,
          linkedField: {
            id: 'q116_lf',
            label: 'Esclareça sua nota.',
            placeholder: 'Justifique a nota atribuída...',
            required: true,
          },
        },
        // Pergunta 117 — Escala 1-5 + linkedField
        {
          id: 'q117',
          type: 'scale',
          label: 'Avalie (1 a 5) a prestação adequada do serviço de saúde em relação a recursos humanos da unidade.',
          required: true,
          scaleMax: 5,
          linkedField: {
            id: 'q117_lf',
            label: 'Esclareça a resposta.',
            placeholder: 'Justifique a nota atribuída...',
            required: true,
          },
        },
        // Pergunta 118 — Escala 1-5 + linkedField
        {
          id: 'q118',
          type: 'scale',
          label: 'Avalie (1 a 5) a prestação adequada do serviço de saúde em relação a estrutura, materiais e equipamentos da unidade.',
          required: true,
          scaleMax: 5,
          linkedField: {
            id: 'q118_lf',
            label: 'Esclareça a resposta.',
            placeholder: 'Justifique a nota atribuída...',
            required: true,
          },
        },
        // Pergunta 119 — sempre visível
        {
          id: 'q119',
          type: 'radio',
          label: 'A UBS possui equipes de saúde da família incompletas?',
          options: ['Sim', 'Não'],
          required: true,
        },
        // Pergunta 120 — sempre visível + linkedField
        {
          id: 'q120',
          type: 'radio',
          label: 'Durante o ano corrente, foi comum haver áreas sem equipes completas?',
          options: ['Sim', 'Não'],
          required: true,
          linkedField: {
            id: 'q120_lf',
            label: 'Esclareça a resposta anterior.',
            placeholder: 'Justifique a resposta...',
            required: true,
          },
        },
        // Pergunta 121 — sempre visível
        {
          id: 'q121',
          type: 'textarea',
          label: 'Sobre a manutenção de equipes de ESF completas, quais são os desafios enfrentados? Quais os profissionais de maior carência na unidade?',
          placeholder: 'Descreva os desafios e carências...',
          required: true,
        },
      ],
    },
  ],
};
