import React, { useState } from 'react';
import { Book, Brain, Calendar, GraduationCap, MessageCircle, Plus, Search, Clock, Sparkles, Edit2, Check, X, ChevronDown } from 'lucide-react';

type Subject = string;
type Message = {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

type ScheduleItem = {
  id: number;
  subject: string;
  time: string;
  color: string;
  status: 'upcoming' | 'next' | 'scheduled';
  duration: number;
  description?: string;
};

function App() {
  const [selectedSubject, setSelectedSubject] = useState<Subject>('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [editingScheduleId, setEditingScheduleId] = useState<number | null>(null);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [newScheduleItem, setNewScheduleItem] = useState<Partial<ScheduleItem>>({});

  const [subjects, setSubjects] = useState([
    { id: 'math', name: 'Matemática', icon: Brain, color: 'indigo' },
    { id: 'science', name: 'Ciências', icon: Book, color: 'emerald' },
    { id: 'history', name: 'História', icon: GraduationCap, color: 'amber' },
    { id: 'literature', name: 'Literatura', icon: MessageCircle, color: 'purple' },
  ]);

  const [schedule, setSchedule] = useState<ScheduleItem[]>([
    { 
      id: 1, 
      subject: 'Matemática', 
      time: '14:00', 
      color: 'indigo', 
      status: 'upcoming',
      duration: 90,
      description: 'Revisão de Álgebra Linear'
    },
    { 
      id: 2, 
      subject: 'Ciências', 
      time: '16:00', 
      color: 'emerald', 
      status: 'next',
      duration: 90,
      description: 'Estudo de Biologia Celular'
    },
    { 
      id: 3, 
      subject: 'História', 
      time: '18:00', 
      color: 'amber', 
      status: 'scheduled',
      duration: 90,
      description: 'História do Brasil - Era Vargas'
    },
  ]);

  // Respostas mais naturais e contextualizadas
  const getAIResponse = (userMessage: string, subject: string) => {
    const subjectInfo = subjects.find(s => s.id === selectedSubject);
    const context = messages.slice(-3); // Considera as últimas 3 mensagens para contexto
    
    const responses = {
      math: [
        "Entendo sua dúvida sobre esse conceito matemático. Vamos quebrar em partes menores?",
        "Interessante sua pergunta! Na matemática, podemos abordar isso de várias formas. Que tal começarmos com um exemplo prático?",
        "Esse é um tópico fascinante da matemática. Deixa eu te mostrar como podemos visualizar isso..."
      ],
      science: [
        "Na ciência, esse fenômeno que você mencionou tem uma explicação muito interessante...",
        "Ótima pergunta! Isso está relacionado com vários conceitos científicos. Vamos explorar?",
        "Do ponto de vista científico, podemos analisar isso em diferentes níveis..."
      ]
    };

    const baseResponse = responses[subject as keyof typeof responses] || [
      "Que interessante sua colocação! Vamos explorar mais esse tema?",
      "Excelente pergunta! Isso me faz pensar em várias conexões importantes...",
      "Entendo sua curiosidade. Esse é um tópico rico que podemos abordar de diferentes ângulos..."
    ];

    return baseResponse[Math.floor(Math.random() * baseResponse.length)] + 
           ` Baseado no que estávamos discutindo sobre ${subjectInfo?.name}, podemos aprofundar esse conceito.`;
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    
    // Resposta mais contextualizada da IA
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(message, selectedSubject),
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);

    setMessage('');
  };

  const handleAddSubject = () => {
    if (!newSubject.trim()) return;
    
    const colors = ['blue', 'green', 'red', 'yellow', 'purple', 'pink'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newSubjectObj = {
      id: newSubject.toLowerCase().replace(/\s+/g, '-'),
      name: newSubject,
      icon: Book,
      color: randomColor
    };
    
    setSubjects([...subjects, newSubjectObj]);
    setNewSubject('');
    setShowAddSubject(false);
  };

  const handleEditSchedule = (id: number) => {
    const item = schedule.find(s => s.id === id);
    if (item) {
      setNewScheduleItem(item);
      setEditingScheduleId(id);
    }
  };

  const handleSaveSchedule = () => {
    if (editingScheduleId) {
      setSchedule(schedule.map(item => 
        item.id === editingScheduleId 
          ? { ...item, ...newScheduleItem as ScheduleItem }
          : item
      ));
    } else {
      setSchedule([...schedule, { 
        ...newScheduleItem as ScheduleItem,
        id: Date.now(),
        status: 'scheduled'
      }]);
    }
    setEditingScheduleId(null);
    setNewScheduleItem({});
    setShowScheduleForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-indigo-600 mr-2" />
            <h1 className="text-4xl font-bold text-indigo-900">Mithras</h1>
          </div>
          <p className="text-lg text-indigo-700">Seu tutor adaptativo personalizado de aprendizagem</p>
        </header>

        <div className="grid md:grid-cols-12 gap-8">
          {/* Subject Selection */}
          <div className="md:col-span-3 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Matérias</h2>
                <button
                  onClick={() => setShowAddSubject(true)}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {showAddSubject && (
                <div className="mb-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      placeholder="Nova matéria..."
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={handleAddSubject}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {subjects.map((subject) => (
                  <button
                    key={subject.id}
                    onClick={() => setSelectedSubject(subject.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      selectedSubject === subject.id
                        ? `bg-${subject.color}-100 text-${subject.color}-900`
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <subject.icon className="w-5 h-5" />
                    <span>{subject.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Cronograma</h2>
                <div className="flex space-x-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  <button
                    onClick={() => {
                      setShowScheduleForm(true);
                      setEditingScheduleId(null);
                      setNewScheduleItem({});
                    }}
                    className="p-1 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {showScheduleForm && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-3">
                    <select
                      value={newScheduleItem.subject || ''}
                      onChange={(e) => setNewScheduleItem({...newScheduleItem, subject: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Selecione a matéria</option>
                      {subjects.map(s => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                    <input
                      type="time"
                      value={newScheduleItem.time || ''}
                      onChange={(e) => setNewScheduleItem({...newScheduleItem, time: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="number"
                      placeholder="Duração (minutos)"
                      value={newScheduleItem.duration || ''}
                      onChange={(e) => setNewScheduleItem({...newScheduleItem, duration: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="Descrição"
                      value={newScheduleItem.description || ''}
                      onChange={(e) => setNewScheduleItem({...newScheduleItem, description: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setShowScheduleForm(false);
                          setNewScheduleItem({});
                        }}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSaveSchedule}
                        className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                      >
                        Salvar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {schedule.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 bg-${item.color}-50 rounded-lg border border-${item.color}-100 relative`}
                  >
                    {editingScheduleId === item.id ? (
                      <div className="space-y-2">
                        <input
                          type="time"
                          value={newScheduleItem.time || item.time}
                          onChange={(e) => setNewScheduleItem({...newScheduleItem, time: e.target.value})}
                          className="w-full px-2 py-1 border rounded"
                        />
                        <input
                          type="text"
                          value={newScheduleItem.description || item.description}
                          onChange={(e) => setNewScheduleItem({...newScheduleItem, description: e.target.value})}
                          className="w-full px-2 py-1 border rounded"
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setEditingScheduleId(null)}
                            className="p-1 text-gray-600 hover:text-gray-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleSaveSchedule}
                            className="p-1 text-green-600 hover:text-green-800"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-1">
                          <p className={`text-sm font-medium text-${item.color}-900`}>
                            {item.subject}
                          </p>
                          <div className="flex items-center space-x-2">
                            {item.status === 'upcoming' && (
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                Próxima
                              </span>
                            )}
                            <button
                              onClick={() => handleEditSchedule(item.id)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center text-xs text-gray-600">
                          <Clock className="w-3 h-3 mr-1" />
                          {item.time} ({item.duration} min)
                        </div>
                        {item.description && (
                          <p className="text-xs text-gray-600 mt-1">
                            {item.description}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="md:col-span-9">
            <div className="bg-white rounded-xl shadow-lg h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-800">
                  {selectedSubject
                    ? subjects.find((s) => s.id === selectedSubject)?.name
                    : 'Selecione uma matéria para começar'}
                </h2>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6">
                {selectedSubject ? (
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-indigo-100 rounded-lg p-4 max-w-[80%]">
                        <p className="text-gray-800">
                          Olá! Como especialista em {subjects.find((s) => s.id === selectedSubject)?.name},
                          estou aqui para ajudar em sua jornada de aprendizado. Podemos discutir conceitos,
                          resolver exercícios ou criar um plano de estudos personalizado. Como posso ajudar você hoje?
                        </p>
                      </div>
                    </div>
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex items-start ${msg.sender === 'user' ? 'justify-end' : ''}`}
                      >
                        <div
                          className={`rounded-lg p-4 max-w-[80%] ${
                            msg.sender === 'user'
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p>{msg.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500 text-center">
                      Escolha uma matéria no menu ao lado para iniciar uma conversa
                    </p>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="p-6 border-t">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={!selectedSubject}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!selectedSubject || !message.trim()}
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;