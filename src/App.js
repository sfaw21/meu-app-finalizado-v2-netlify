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
            <span className="font-semibold text-base uppercase">{cardName || 'SEU NOME'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs opacity-80">Válido até</span>
            <span className="font-semibold text-base">{cardValidity || 'MM/AA'}</span>
          </div>
        </div>
      </div>

      {/* Verso do Cartão de Resumo */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex flex-col justify-center items-center p-6"
        style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
      >
        <div className="w-full h-10 bg-gray-800 rounded-md mb-4"></div>
        <div className="w-full text-right text-gray-200 font-mono text-lg pr-2">{cardCvv || '•••'}</div>
        <span className="text-xs opacity-80 mt-2">CVV</span>
      </div>
    </div>
  );
};


function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [deliveryOption, setDeliveryOption] = useState(null); // 'correios' ou 'expressa'
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null); // 'credit_card' ou 'pix'

  // Estados para dados do cartão de crédito
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardValidity, setCardValidity] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isCvvFocused, setIsCvvFocused] = useState(false);

  // Estado para chave Pix (simulada)
  const [pixKey, setPixKey] = useState('');

  // Funções para lidar com mudanças
  const handleDeliveryOptionChange = (option) => {
    setDeliveryOption(option);
  };

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\s/g, '').slice(0, 16);
    setCardNumber(value.replace(/(\d{4})(?=\d)/g, '$1 '));
  };

  const handleCardValidityChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardValidity(value.replace(/(\d{2})(?=\d)/g, '$1/'));
  };

  // Efeito para gerar uma chave Pix simulada ao selecionar Pix
  useEffect(() => {
    if (selectedPaymentMethod === 'pix') {
      // Gera uma chave Pix aleatória simplificada para simulação
      const generatedKey = `chavepix${Math.random().toString(36).substring(2, 10)}@email.com`;
      setPixKey(generatedKey);
    }
  }, [selectedPaymentMethod]);


  // Função para copiar a chave Pix (apenas simulação)
  const handleCopyPixKey = () => {
    navigator.clipboard.writeText(pixKey)
      .then(() => {
        alert('Chave Pix copiada!');
      })
      .catch(err => {
        console.error('Erro ao copiar a chave Pix:', err);
      });
  };

  // Funções para lidar com a finalização do pedido (apenas placeholders)
  const handleFinalizeOrder = () => {
    // Aqui você integraria a lógica real de processamento de pagamento
    alert('Pedido finalizado com Cartão de Crédito! (Simulação)');
    setCurrentStep(4); // Vai para a tela de confirmação
  };

  const handlePixPaymentComplete = () => {
    // Lógica para verificar o pagamento Pix (em um app real, seria uma integração backend)
    alert('Pagamento Pix confirmado! (Simulação)');
    setCurrentStep(4); // Vai para a tela de confirmação
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12">
      <h1 className="text-5xl font-extrabold text-blue-800 mb-12 text-center">Checkout Fantástico</h1>

      {/* Indicador de Progresso */}
      <div className="flex justify-between w-full max-w-2xl mb-12 relative">
        <div className="absolute inset-x-0 top-1/2 h-1 bg-gray-300 transform -translate-y-1/2"></div>
        {[1, 2, 3, 4].map((stepNum) => (
          <div key={stepNum} className="relative flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl z-10 transition-all duration-300
                ${currentStep >= stepNum ? 'bg-blue-600 shadow-lg transform scale-105' : 'bg-gray-400'}`}
            >
              {stepNum}
            </div>
            <span className="mt-2 text-gray-700 text-sm font-medium whitespace-nowrap">
              {stepNum === 1 && 'Informações'}
              {stepNum === 2 && 'Entrega'}
              {stepNum === 3 && 'Pagamento'}
              {stepNum === 4 && 'Confirmação'}
            </span>
          </div>
        ))}
      </div>

      <div className="w-full max-w-4xl bg-white p-10 rounded-xl shadow-2xl">
        {/* Passo 1: Informações Pessoais (Simplificado) */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Suas Informações</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">Nome Completo</label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
                  placeholder="Seu nome aqui"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
                  placeholder="seu.email@example.com"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg"
                >
                  Continuar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Passo 2: Opções de Entrega */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Opções de Entrega</h2>
            <div className="space-y-6">
              <label
                className={`flex items-center p-6 border rounded-lg shadow-md cursor-pointer transition-all duration-300
                           ${deliveryOption === 'correios' ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500' : 'border-gray-300 bg-white hover:bg-gray-50'}`}
              >
                <input
                  type="radio"
                  name="delivery"
                  value="correios"
                  checked={deliveryOption === 'correios'}
                  onChange={() => handleDeliveryOptionChange('correios')}
                  className="form-radio h-6 w-6 text-blue-600 mr-4"
                />
                <div className="flex-1 flex items-center">
                  <Truck size={32} className="text-blue-600 mr-4" />
                  <div>
                    <span className="block text-xl font-semibold text-gray-800">Entrega Padrão (Correios)</span>
                    <span className="block text-gray-600">Prazo: 6-9 dias úteis - Grátis</span>
                  </div>
                </div>
              </label>

              <label
                className={`flex items-center p-6 border rounded-lg shadow-md cursor-pointer transition-all duration-300
                           ${deliveryOption === 'expressa' ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500' : 'border-gray-300 bg-white hover:bg-gray-50'}`}
              >
                <input
                  type="radio"
                  name="delivery"
                  value="expressa"
                  checked={deliveryOption === 'expressa'}
                  onChange={() => handleDeliveryOptionChange('expressa')}
                  className="form-radio h-6 w-6 text-blue-600 mr-4"
                />
                <div className="flex-1 flex items-center">
                  <Zap size={32} className="text-blue-600 mr-4" />
                  <div>
                    <span className="block text-xl font-semibold text-gray-800">Entrega Expressa</span>
                    <span className="block text-gray-600">Prazo: 3-5 dias úteis - R$ 15,00</span>
                  </div>
                </div>
              </label>
            </div>
            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-bold text-lg hover:bg-gray-400 transition-colors duration-300"
              >
                Voltar
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                disabled={!deliveryOption}
                className={`px-8 py-4 rounded-lg font-bold text-lg transition-colors duration-300 ${!deliveryOption ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'}`}
              >
                Continuar para Pagamento
              </button>
            </div>
          </div>
        )}

        {/* Passo 3: Pagamento */}
        {currentStep === 3 && (
          <div className="flex flex-col items-center justify-center p-6 bg-gray-50 min-h-screen"> {/* Fundo da página do Passo 3: Pagamento (tela cinza claro) */}
            <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-2xl">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Finalizar Pedido</h2>

              {/* Seções de Pagamento */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Selecione o Método de Pagamento</h3>
                <div className="flex justify-center space-x-6 mb-8">
                  <button
                    onClick={() => handlePaymentMethodChange('credit_card')}
                    className={`px-6 py-3 rounded-lg text-lg font-semibold flex items-center space-x-2 transition-all duration-300 ${selectedPaymentMethod === 'credit_card' ? 'bg-blue-600 text-white shadow-lg transform scale-105' : 'bg-gray-200 text-gray-700 hover:bg-blue-100'}`}
                  >
                    <Clipboard size={24} /> <span>Cartão de Crédito</span>
                  </button>
                  <button
                    onClick={() => handlePaymentMethodChange('pix')}
                    className={`px-6 py-3 rounded-lg text-lg font-semibold flex items-center space-x-2 transition-all duration-300 ${selectedPaymentMethod === 'pix' ? 'bg-blue-600 text-white shadow-lg transform scale-105' : 'bg-gray-200 text-gray-700 hover:bg-blue-100'}`}
                  >
                    <Smartphone size={24} /> <span>Pix</span>
                  </button>
                </div>

                {selectedPaymentMethod === 'credit_card' && (
                  <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg mx-auto">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Pagamento com Cartão de Crédito</h2>
                    {/* Campos do Cartão */}
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="cardName" className="block text-lg font-medium text-gray-700 mb-2">Nome no Cartão</label>
                        <input
                          type="text"
                          id="cardName"
                          className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
                          placeholder="Nome impresso no cartão"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label htmlFor="cardNumber" className="block text-lg font-medium text-gray-700 mb-2">Número do Cartão</label>
                        <input
                          type="text"
                          id="cardNumber"
                          className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
                          placeholder="•••• •••• •••• ••••"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          maxLength="19"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="cardValidity" className="block text-lg font-medium text-gray-700 mb-2">Validade (MM/AA)</label>
                          <input
                            type="text"
                            id="cardValidity"
                            className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
                            placeholder="MM/AA"
                            value={cardValidity}
                            onChange={handleCardValidityChange}
                            maxLength="5"
                          />
                        </div>
                        <div>
                          <label htmlFor="cardCvv" className="block text-lg font-medium text-gray-700 mb-2">CVV</label>
                          <input
                            type="text"
                            id="cardCvv"
                            className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
                            placeholder="•••"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            onFocus={() => setIsCvvFocused(true)}
                            onBlur={() => setIsCvvFocused(false)}
                            maxLength="4"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Seção do Resumo do Cartão */}
                    <div className="flex justify-center mt-8 mb-6">
                      <CardSummaryDisplay
                        cardName={cardName}
                        cardValidity={cardValidity}
                        cardNumber={cardNumber}
                        cardCvv={cardCvv}
                        isCvvFocused={isCvvFocused}
                      />
                    </div>

                    <div className="mt-8 flex justify-between">
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-bold text-lg hover:bg-gray-400 transition-colors duration-300"
                      >
                        Voltar
                      </button>
                      <button
                        onClick={handleFinalizeOrder} // Chama a função para finalizar o pedido
                        className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-green-600 transition-colors duration-300"
                      >
                        Pagar com Cartão
                      </button>
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === 'pix' && (
                  <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg mx-auto"> {/* Fundo da caixa do Pix (mantido bg-white) */}
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Pagamento via Pix</h2>
                    
                    {/* Fundo da área do QR Code Pix (mantido #e6dcd0 para o quadrado interno) */}
                    <div className="bg-[#e6dcd0] p-4 rounded-md text-center"> 
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixKey)}`} alt="QR Code Pix" className="mx-auto mb-4 w-48 h-48 border border-gray-300 rounded" />
                      <p className="font-mono break-all text-gray-700 text-lg mb-4 select-all">{pixKey}</p>
                      <button
                        onClick={handleCopyPixKey}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center mx-auto"
                      >
                        <Copy size={20} className="mr-2" /> Copiar Chave Pix
                      </button>
                    </div>

                    <button
                      onClick={handlePixPaymentComplete} // Chama a função para simular pagamento Pix
                      className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-green-600 transition-colors duration-300 mt-6 w-full"
                    >
                      Já paguei com Pix
                    </button>

                    <div className="mt-8 flex justify-between">
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-bold text-lg hover:bg-gray-400 transition-colors duration-300"
                      >
                        Voltar
                      </button>
                      {/* Botão de pagamento finalizado Pix seria aqui se a lógica fosse diferente */}
                    </div>
                  </div>
                )}
              </div>

              {/* Seção de Detalhes do Pedido (placeholder) */}
              <div className="bg-gray-100 p-4 rounded-md mb-6 text-left">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Detalhes do Pedido:</h3>
                <p className="text-gray-600"><strong>Número do Pedido:</strong> #2196</p>
                <p className="text-gray-600"><strong>Método de Pagamento:</strong> {selectedPaymentMethod === 'credit_card' ? 'Cartão de Crédito' : 'Pix'}</p>
                <p className="text-gray-600"><strong>Total:</strong> R$ 94,05</p>
                <p className="text-gray-600"><strong>Entrega Estimada:</strong> {deliveryOption === 'correios' ? '6 a 9 dias úteis' : '3 a 5 dias úteis'}</p>
              </div>

            </div>
          </div>
        )}

        {/* Passo 4: Confirmação do Pedido */}
        {currentStep === 4 && (
          <div className="flex flex-col items-center justify-center p-6 bg-[#e6dcd0] min-h-screen"> {/* ALTERADO AQUI: bg-green-50 para bg-[#e6dcd0] */}
            <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow-2xl text-center"> {/* Fundo da caixa é branco */}
              <CheckCircle size={80} className="text-green-500 mx-auto mb-6" />
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Pedido Confirmado!</h2>
              <p className="text-xl text-gray-700 mb-8">Obrigado pela sua compra. Seu pedido foi processado com sucesso!</p>

              {/* Seção de Detalhes do Pedido */}
              <div className="bg-gray-100 p-4 rounded-md mb-6 text-left">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Detalhes do Pedido:</h3>
                <p className="text-gray-600"><strong>Número do Pedido:</strong> #2196</p>
                <p className="text-gray-600"><strong>Método de Pagamento:</strong> {selectedPaymentMethod === 'credit_card' ? 'Cartão de Crédito' : 'Pix'}</p>
                <p className="text-gray-600"><strong>Total:</strong> R$ 94,05</p>
                <p className="text-gray-600"><strong>Entrega Estimada:</strong> {deliveryOption === 'correios' ? '6 a 9 dias úteis' : '3 a 5 dias úteis'}</p>
              </div>
              <button
                onClick={() => setCurrentStep(1)} // Opção para reiniciar o processo
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
              >
                Voltar ao Início
              </button>
            </div>
          </div>
        )}

        {/* Default / Fallback para passos desconhecidos */}
        {currentStep > 4 && (
          <div className="text-center p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Página não encontrada</h2>
            <p className="text-lg text-gray-600">Ocorreu um erro ou você tentou acessar um passo inválido.</p>
            <button
              onClick={() => setCurrentStep(1)}
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors duration-300"
            >
              Voltar ao Início
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;