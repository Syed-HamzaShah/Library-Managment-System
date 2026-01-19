import React, { useEffect, useState } from 'react';
import { getMembers, createMember, deleteMember } from '../services/api';

const Members = () => {
    const [members, setMembers] = useState([]);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '', email: '', phone: ''
    });

    useEffect(() => {
        loadMembers();
    }, [search]);

    const loadMembers = async () => {
        try {
            const data = await getMembers(search);
            setMembers(data);
        } catch (error) {
            console.error(error);
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

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure?")) {
            try {
                await deleteMember(id);
                loadMembers();
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1>Member Management</h1>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Close Form' : 'Add Member'}
                </button>
            </div>

            {showForm && (
                <div className="card">
                    <form onSubmit={handleSubmit}>
                        <div className="flex gap-4">
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Name</label>
                                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Email</label>
                                <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Phone</label>
                                <input required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary">Save Member</button>
                    </form>
                </div>
            )}

            <div className="card">
                <div className="form-group">
                    <input
                        placeholder="Search by name or ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>ID</th>
                                <th>Joined Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map(member => (
                                <tr key={member.id}>
                                    <td>{member.name}</td>
                                    <td>{member.email}</td>
                                    <td>{member.phone}</td>
                                    <td><small>{member.id}</small></td>
                                    <td>{member.joined_date}</td>
                                    <td>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(member.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Members;
