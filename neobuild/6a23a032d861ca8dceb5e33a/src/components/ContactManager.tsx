import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, MoreVertical, Mail, Phone, Building2, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Contact, ContactType } from '../types/contact';
import ContactForm from './ContactForm';
import { useAuth } from '../context/AuthContext';

const ContactManager: React.FC = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<ContactType | 'all'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | undefined>();

  useEffect(() => {
    if (user) fetchContacts();
  }, [user]);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (contactData: Partial<Contact>) => {
    try {
      if (editingContact) {
        const { error } = await supabase
          .from('contacts')
          .update(contactData)
          .eq('id', editingContact.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('contacts')
          .insert([{ ...contactData, user_id: user?.id }]);
        if (error) throw error;
      }
      fetchContacts();
    } catch (error) {
      console.error('Error saving contact:', error);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    try {
      const { error } = await supabase.from('contacts').delete().eq('id', id);
      if (error) throw error;
      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || contact.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTypeColor = (type: ContactType) => {
    switch (type) {
      case 'customer': return 'bg-blue-100 text-blue-700';
      case 'supplier': return 'bg-purple-100 text-purple-700';
      case 'employee': return 'bg-green-100 text-green-700';
      case 'partner': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-500">Manage your customers, suppliers, and team members.</p>
        </div>
        <button
          onClick={() => { setEditingContact(undefined); setIsFormOpen(true); }}
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-all shadow-md shadow-primary/10"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Contact
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as ContactType | 'all')}
            >
              <option value="all">All Types</option>
              <option value="customer">Customers</option>
              <option value="supplier">Suppliers</option>
              <option value="employee">Employees</option>
              <option value="partner">Partners</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Company</th>
                <th className="px-6 py-4 font-medium">Contact Info</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                        {contact.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getTypeColor(contact.type)}`}>
                      {contact.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {contact.company || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {contact.email && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="h-3.5 w-3.5 mr-2" />
                          {contact.email}
                        </div>
                      )}
                      {contact.phone && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="h-3.5 w-3.5 mr-2" />
                          {contact.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => { setEditingContact(contact); setIsFormOpen(true); }}
                        className="p-2 text-gray-400 hover:text-primary transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(contact.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredContacts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No contacts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <ContactForm
          contact={editingContact}
          onSave={handleSave}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default ContactManager;