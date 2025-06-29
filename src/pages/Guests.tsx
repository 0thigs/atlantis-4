import React, { useState, useMemo } from 'react';
import { PlusCircle, Edit, Trash2, X, Search, Filter, Eye, Calendar, Globe, Users } from 'lucide-react';
import { Guest } from '../types';
import { useHotelData } from '../hooks/useHotelData';
import DependentManager from '../components/DependentManager';

const Guests = () => {
  const { guests, addGuest, updateGuest, deleteGuest, getDependentsByGuestId } = useHotelData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDependentManagerOpen, setIsDependentManagerOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [viewingGuest, setViewingGuest] = useState<Guest | null>(null);
  const [deletingGuest, setDeletingGuest] = useState<Guest | null>(null);
  const [managingDependentsGuest, setManagingDependentsGuest] = useState<Guest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [nationalityFilter, setNationalityFilter] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [formData, setFormData] = useState<Omit<Guest, 'id'>>({
    name: '',
    email: '',
    phone: '',
    document: '',
    address: '',
    birthDate: '',
    nationality: ''
  });

  const availableNationalities = useMemo(() => {
    const nationalities = [...new Set(guests.map(guest => guest.nationality))];
    return nationalities.sort();
  }, [guests]);

  const filteredGuests = useMemo(() => {
    return guests.filter(guest => {
      const matchesSearch = searchTerm === '' ||
        guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.document.includes(searchTerm) ||
        guest.phone.includes(searchTerm);

      const matchesNationality = nationalityFilter === '' || guest.nationality === nationalityFilter;

      return matchesSearch && matchesNationality;
    });
  }, [guests, searchTerm, nationalityFilter]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      document: '',
      address: '',
      birthDate: '',
      nationality: ''
    });
    setEditingGuest(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGuest) {
      updateGuest(editingGuest.id, formData);
    } else {
      addGuest({ ...formData, id: String(Date.now()) });
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setFormData({
      name: guest.name,
      email: guest.email,
      phone: guest.phone,
      document: guest.document,
      address: guest.address,
      birthDate: guest.birthDate,
      nationality: guest.nationality
    });
    setIsModalOpen(true);
  };

  const handleView = (guest: Guest) => {
    setViewingGuest(guest);
    setIsDetailModalOpen(true);
  };

  const handleDeleteClick = (guest: Guest) => {
    setDeletingGuest(guest);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deletingGuest) {
      deleteGuest(deletingGuest.id);
      setIsDeleteModalOpen(false);
      setDeletingGuest(null);
    }
  };

  const handleManageDependents = (guest: Guest) => {
    setManagingDependentsGuest(guest);
    setIsDependentManagerOpen(true);
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

  const clearFilters = () => {
    setSearchTerm('');
    setNationalityFilter('');
    setIsFilterOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Gestão de Hóspedes</h1>
          <p className="text-gray-600">Gerencie hóspedes do hotel e suas informações</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex gap-2 justify-center items-center px-4 py-2 w-full text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700 sm:w-auto"
        >
          <PlusCircle className="w-5 h-5" />
          Adicionar Novo Hóspede
        </button>
      </div>

      <div className="p-4 bg-white rounded-lg shadow-md">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 w-5 h-5 text-gray-400 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar hóspedes por nome, email, documento ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-2 pr-4 pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${isFilterOpen || nationalityFilter
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filtros</span>
              {nationalityFilter && <span className="px-2 py-1 text-xs text-white bg-blue-600 rounded-full">1</span>}
            </button>
            {(searchTerm || nationalityFilter) && (
              <button
                onClick={clearFilters}
                className="hidden px-4 py-2 text-gray-600 hover:text-gray-800 sm:block"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {isFilterOpen && (
          <div className="pt-4 mt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Nacionalidade
                </label>
                <select
                  value={nationalityFilter}
                  onChange={(e) => setNationalityFilter(e.target.value)}
                  className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todas as Nacionalidades</option>
                  {availableNationalities.map(nationality => (
                    <option key={nationality} value={nationality}>{nationality}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 text-sm text-gray-600 sm:flex-row sm:justify-between sm:items-center">
        <span>
          Mostrando {filteredGuests.length} de {guests.length} hóspedes
          {searchTerm && ` correspondendo a "${searchTerm}"`}
          {nationalityFilter && ` com nacionalidade "${nationalityFilter}"`}
        </span>
        {(searchTerm || nationalityFilter) && (
          <button
            onClick={clearFilters}
            className="text-blue-600 hover:text-blue-800 sm:hidden"
          >
            Limpar filtros
          </button>
        )}
      </div>

      <div className="overflow-hidden bg-white rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6">
                  Hóspede
                </th>
                <th className="hidden px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6 sm:table-cell">
                  Contato
                </th>
                <th className="hidden px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6 md:table-cell">
                  Documento
                </th>
                <th className="hidden px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6 lg:table-cell">
                  Idade
                </th>
                <th className="hidden px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6 lg:table-cell">
                  Nacionalidade
                </th>
                <th className="hidden px-3 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase sm:px-6 md:table-cell">
                  Dependentes
                </th>
                <th className="px-3 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase sm:px-6">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGuests.map((guest) => (
                <tr key={guest.id} className="hover:bg-gray-50">
                  <td className="px-3 py-4 whitespace-nowrap sm:px-6">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{guest.name}</div>
                      <div className="max-w-xs text-sm text-gray-500 truncate">{guest.address}</div>
                      <div className="mt-1 space-y-1 text-xs text-gray-500 sm:hidden">
                        <div>{guest.email}</div>
                        <div>{guest.phone}</div>
                        <div className="md:hidden">Doc: {guest.document}</div>
                        <div className="lg:hidden">{calculateAge(guest.birthDate)} anos - {guest.nationality}</div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-3 py-4 whitespace-nowrap sm:px-6 sm:table-cell">
                    <div>
                      <div className="text-sm text-gray-900">{guest.email}</div>
                      <div className="text-sm text-gray-500">{guest.phone}</div>
                    </div>
                  </td>
                  <td className="hidden px-3 py-4 text-sm text-gray-900 whitespace-nowrap sm:px-6 md:table-cell">
                    {guest.document}
                  </td>
                  <td className="hidden px-3 py-4 text-sm text-gray-900 whitespace-nowrap sm:px-6 lg:table-cell">
                    {calculateAge(guest.birthDate)} anos
                  </td>
                  <td className="hidden px-3 py-4 whitespace-nowrap sm:px-6 lg:table-cell">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Globe className="mr-1 w-3 h-3" />
                      {guest.nationality}
                    </span>
                  </td>
                  <td className="hidden px-3 py-4 text-center whitespace-nowrap sm:px-6 md:table-cell">
                    <button
                      onClick={() => handleManageDependents(guest)}
                      className="inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                      title="Gerenciar Dependentes"
                    >
                      <Users className="mr-1 w-3 h-3" />
                      {getDependentsByGuestId(guest.id).length}
                    </button>
                  </td>
                  <td className="px-3 py-4 text-sm font-medium text-right whitespace-nowrap sm:px-6">
                    <div className="flex gap-1 justify-end sm:gap-2">
                      <button
                        onClick={() => handleView(guest)}
                        className="p-1 text-gray-600 hover:text-gray-800"
                        title="Ver Detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleManageDependents(guest)}
                        className="p-1 text-green-600 hover:text-green-800 md:hidden"
                        title="Gerenciar Dependentes"
                      >
                        <Users className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(guest)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Editar Hóspede"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(guest)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Deletar Hóspede"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredGuests.length === 0 && (
          <div className="py-12 text-center">
            <div className="text-gray-500">
              {searchTerm || nationalityFilter ? 'Nenhum hóspede corresponde aos seus critérios de busca.' : 'Nenhum hóspede encontrado.'}
            </div>
            {(searchTerm || nationalityFilter) && (
              <button
                onClick={clearFilters}
                className="mt-2 text-blue-600 hover:text-blue-800"
              >
                Limpar filtros
              </button>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  {editingGuest ? 'Editar Hóspede' : 'Adicionar Novo Hóspede'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
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
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Documento (CPF/RG/Passaporte) *
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
                      Nacionalidade *
                    </label>
                    <input
                      type="text"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleInputChange}
                      required
                      className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Endereço Completo *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 justify-end pt-6 border-t border-gray-200 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="order-2 px-6 py-2 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 sm:order-1"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="order-1 px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 sm:order-2"
                  >
                    {editingGuest ? 'Atualizar Hóspede' : 'Adicionar Hóspede'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {isDetailModalOpen && viewingGuest && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-2xl bg-white rounded-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Detalhes do Hóspede</h2>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nome Completo</label>
                    <p className="text-lg font-semibold text-gray-900">{viewingGuest.name}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{viewingGuest.email}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Telefone</label>
                    <p className="text-gray-900">{viewingGuest.phone}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Documento</label>
                    <p className="text-gray-900">{viewingGuest.document}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Data de Nascimento</label>
                    <div className="flex gap-2 items-center">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">
                        {new Date(viewingGuest.birthDate).toLocaleDateString()}
                        <span className="ml-2 text-gray-500">({calculateAge(viewingGuest.birthDate)} anos)</span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Nacionalidade</label>
                    <div className="flex gap-2 items-center">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{viewingGuest.nationality}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Endereço</label>
                    <p className="text-gray-900">{viewingGuest.address}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Dependentes</h3>
                  <button
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      handleManageDependents(viewingGuest);
                    }}
                    className="flex gap-2 items-center px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-md transition-colors hover:bg-blue-100"
                  >
                    <Users className="w-4 h-4" />
                    Gerenciar
                  </button>
                </div>
                {getDependentsByGuestId(viewingGuest.id).length === 0 ? (
                  <p className="text-sm text-gray-500">Nenhum dependente cadastrado.</p>
                ) : (
                  <div className="space-y-2">
                    {getDependentsByGuestId(viewingGuest.id).map((dependent) => (
                      <div key={dependent.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{dependent.name}</p>
                          <p className="text-sm text-gray-600">
                            {dependent.relationship === 'spouse' ? 'Cônjuge' :
                              dependent.relationship === 'child' ? 'Filho(a)' :
                                dependent.relationship === 'parent' ? 'Pai/Mãe' :
                                  dependent.relationship === 'sibling' ? 'Irmão(ã)' :
                                    'Outro'} - {calculateAge(dependent.birthDate)} anos
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end pt-4 mt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    handleEdit(viewingGuest);
                  }}
                  className="flex gap-2 items-center px-4 py-2 text-white bg-blue-600 rounded-md transition-colors hover:bg-blue-700"
                >
                  <Edit className="w-4 h-4" />
                  Editar Hóspede
                </button>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 text-gray-700 rounded-md border border-gray-300 transition-colors hover:bg-gray-50"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && deletingGuest && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md bg-white rounded-lg">
            <div className="p-6">
              <div className="flex gap-4 items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="flex justify-center items-center w-10 h-10 bg-red-100 rounded-full">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Excluir Hóspede</h3>
                  <p className="mb-6 text-gray-700">
                    Tem certeza de que deseja excluir <strong>{deletingGuest.name}</strong>?
                    {getDependentsByGuestId(deletingGuest.id).length > 0 && (
                      <span className="block mt-2 font-medium text-orange-600">
                        ⚠️ Este hóspede possui {getDependentsByGuestId(deletingGuest.id).length} dependente(s) que também serão excluídos.
                      </span>
                    )}
                    <span className="block mt-2">Todos os dados associados serão permanentemente removidos.</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-gray-700 rounded-md border border-gray-300 transition-colors hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-white bg-red-600 rounded-md transition-colors hover:bg-red-700"
                >
                  Excluir Hóspede
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isDependentManagerOpen && managingDependentsGuest && (
        <DependentManager
          guest={managingDependentsGuest}
          isOpen={isDependentManagerOpen}
          onClose={() => {
            setIsDependentManagerOpen(false);
            setManagingDependentsGuest(null);
          }}
        />
      )}
    </div>
  );
};

export default Guests;