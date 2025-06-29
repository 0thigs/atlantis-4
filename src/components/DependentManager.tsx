import React, { useState } from 'react';
import { Users, Plus, Edit, Trash2, X, Calendar, User, Heart } from 'lucide-react';
import { Dependent, Guest } from '../types';
import { useHotelData } from '../hooks/useHotelData';

interface DependentManagerProps {
  guest: Guest;
  isOpen: boolean;
  onClose: () => void;
}

const DependentManager: React.FC<DependentManagerProps> = ({
  guest,
  isOpen,
  onClose
}) => {
  const { dependents, addDependent, updateDependent, deleteDependent, getDependentsByGuestId } = useHotelData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDependent, setEditingDependent] = useState<Dependent | null>(null);
  const [formData, setFormData] = useState<Omit<Dependent, 'id'>>({
    guestId: guest.id,
    name: '',
    document: '',
    birthDate: '',
    relationship: 'child',
    specialNeeds: ''
  });

  const guestDependents = getDependentsByGuestId(guest.id);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      guestId: guest.id,
      name: '',
      document: '',
      birthDate: '',
      relationship: 'child',
      specialNeeds: ''
    });
    setEditingDependent(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDependent) {
      updateDependent(editingDependent.id, formData);
    } else {
      addDependent({ ...formData, id: String(Date.now()) });
    }
    setIsFormOpen(false);
    resetForm();
  };

  const handleEdit = (dependent: Dependent) => {
    setEditingDependent(dependent);
    setFormData({
      guestId: dependent.guestId,
      name: dependent.name,
      document: dependent.document,
      birthDate: dependent.birthDate,
      relationship: dependent.relationship,
      specialNeeds: dependent.specialNeeds || ''
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza de que deseja excluir este dependente?')) {
      deleteDependent(id);
    }
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getRelationshipLabel = (relationship: string) => {
    const labels = {
      spouse: 'Cônjuge',
      child: 'Filho(a)',
      parent: 'Pai/Mãe',
      sibling: 'Irmão(ã)',
      other: 'Outro'
    };
    return labels[relationship as keyof typeof labels] || relationship;
  };

  const getRelationshipIcon = (relationship: string) => {
    switch (relationship) {
      case 'spouse':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'child':
        return <User className="w-4 h-4 text-blue-500" />;
      case 'parent':
        return <Users className="w-4 h-4 text-green-500" />;
      case 'sibling':
        return <Users className="w-4 h-4 text-purple-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 sm:p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Dependentes de {guest.name}</h2>
              <p className="text-gray-600">Gerencie os dependentes do hóspede</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex gap-2 items-center">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700">{guestDependents.length} dependente(s) cadastrado(s)</span>
            </div>
            <button
              onClick={() => {
                resetForm();
                setIsFormOpen(true);
              }}
              className="flex gap-2 justify-center items-center px-4 py-2 w-full text-white bg-blue-600 rounded-lg hover:bg-blue-700 sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              Adicionar Dependente
            </button>
          </div>

          {guestDependents.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="mx-auto mb-4 w-12 h-12 text-gray-400" />
              <p className="text-gray-500">Nenhum dependente cadastrado.</p>
              <p className="text-sm text-gray-400">Adicione dependentes usando o botão acima.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {guestDependents.map((dependent) => (
                <div key={dependent.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-2 items-center">
                      {getRelationshipIcon(dependent.relationship)}
                      <h3 className="font-semibold text-gray-900">{dependent.name}</h3>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(dependent)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Editar dependente"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(dependent.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Excluir dependente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Relacionamento:</span>
                      <span className="ml-2 font-medium">{getRelationshipLabel(dependent.relationship)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Idade:</span>
                      <span className="ml-2 font-medium">{calculateAge(dependent.birthDate)} anos</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Documento:</span>
                      <span className="ml-2 font-medium">{dependent.document}</span>
                    </div>
                    {dependent.specialNeeds && (
                      <div>
                        <span className="text-gray-600">Necessidades Especiais:</span>
                        <p className="mt-1 text-sm text-gray-700">{dependent.specialNeeds}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="flex fixed inset-0 justify-center items-center p-4 bg-black bg-opacity-50 z-60">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                  {editingDependent ? 'Editar Dependente' : 'Adicionar Dependente'}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Documento (CPF/RG) *
                  </label>
                  <input
                    type="text"
                    name="document"
                    value={formData.document}
                    onChange={handleInputChange}
                    required
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Data de Nascimento *
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    required
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Relacionamento *
                  </label>
                  <select
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleInputChange}
                    required
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="child">Filho(a)</option>
                    <option value="spouse">Cônjuge</option>
                    <option value="parent">Pai/Mãe</option>
                    <option value="sibling">Irmão(ã)</option>
                    <option value="other">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Necessidades Especiais
                  </label>
                  <textarea
                    name="specialNeeds"
                    value={formData.specialNeeds}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Descreva qualquer necessidade especial..."
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex flex-col gap-3 justify-end pt-4 border-t border-gray-200 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="order-2 px-4 py-2 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 sm:order-1"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="order-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 sm:order-2"
                  >
                    {editingDependent ? 'Atualizar' : 'Adicionar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DependentManager; 