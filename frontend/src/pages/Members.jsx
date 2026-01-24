import React, { useEffect, useState } from 'react';
import { getMembers, createMember, deleteMember } from '../services/api';
import { motion } from 'framer-motion';
import { Plus, Search, Users, X } from 'lucide-react';
import { MemberRow } from '../components/members/MemberRow';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const Members = () => {
    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '', email: '', phone: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMembers();
    }, []);

    useEffect(() => {
        let result = members;

        if (search) {
            result = result.filter(member =>
                (member.name && member.name.toLowerCase().includes(search.toLowerCase())) ||
                (member.email && member.email.toLowerCase().includes(search.toLowerCase())) ||
                (member.id && member.id.toString().includes(search))
            );
        }

        setFilteredMembers(result);
    }, [search, members]);

    const loadMembers = async () => {
        setLoading(true);
        try {
            const data = await getMembers();
            setMembers(data);
            setFilteredMembers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createMember(formData);
            setShowForm(false);
            setFormData({ name: '', email: '', phone: '' });
            loadMembers();
        } catch (error) {
            alert(error.response?.data?.detail || "Error creating member");
        }
    };

    const handleDelete = async (member) => {
        if (window.confirm(`Are you sure you want to delete ${member.name}?`)) {
            try {
                await deleteMember(member.id);
                loadMembers();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleEdit = (member) => {
        alert(`Edit feature for ${member.name} to be implemented fully.`);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-gradient">Members</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage members and member information
                    </p>
                </div>
                <Button className="gradient-accent text-accent-foreground gap-2" onClick={() => setShowForm(!showForm)}>
                    {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {showForm ? 'Cancel' : 'Add New Member'}
                </Button>
            </div>

            {/* Form Card */}
            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-xl p-6 shadow-sm"
                >
                    <h2 className="text-lg font-semibold mb-4">Add New Member</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Name</label>
                                <Input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Full Name" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="Email Address" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Phone</label>
                                <Input required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="Phone Number" />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit">Save Member</Button>
                        </div>
                    </form>
                </motion.div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4">
                <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                        <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{members.length}</p>
                        <p className="text-sm text-muted-foreground">Total Members</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name, email, or member ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Results Count */}
            <p className="text-sm text-muted-foreground">
                Showing {filteredMembers.length} of {members.length} members
            </p>

            {/* Member List */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredMembers.map((member, index) => (
                        <MemberRow
                            key={member.id}
                            member={member}
                            index={index}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {!loading && filteredMembers.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No members found matching your criteria.</p>
                </div>
            )}
        </motion.div>
    );
};

export default Members;
