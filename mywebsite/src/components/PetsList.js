import { useState, useEffect } from 'react';
import './PetsList.css';

const PetsList = () => {
    const [pets, setPets] = useState([]);
    const [newPet, setNewPet] = useState({
        name: '',
        age: '',
        breed: '',
        description: ''
    });
    const [editingPet, setEditingPet] = useState(null);
    const [error, setError] = useState('');
    const [isAddingPet, setIsAddingPet] = useState(false);

    useEffect(() => {
        fetchPets();
    }, []);

    const fetchPets = async () => {
        try {
            console.log('Fetching pets...');
            const response = await fetch('http://localhost:8888/petprofiles', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                },
                credentials: 'include'
            });

            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Failed to fetch pets');
            }

            const data = await response.json();
            console.log('Fetched pets:', data);
            setPets(data);
            setError(''); // Clear any previous errors
        } catch (err) {
            console.error('Error fetching pets:', err);
            setError(err.message || 'Failed to load pets');
        }
    };

    const handleAddPet = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8888/user/pets/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPet),
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Failed to add pet');
            
            fetchPets();
            setIsAddingPet(false);
            setNewPet({
                name: '',
                age: '',
                breed: '',
                description: ''
            });
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdatePet = async (e) => {
        e.preventDefault();
        if (!editingPet) return;

        try {
            console.log('Sending update request with data:', editingPet);
            
            const response = await fetch(`http://localhost:8888/user/pets/edit/${editingPet.id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: editingPet.name,
                    age: parseInt(editingPet.age, 10),
                    breed: editingPet.breed,
                    description: editingPet.description
                }),
                credentials: 'include'
            });

            console.log('Raw response:', response);

            const data = await response.json().catch(e => {
                console.error('Failed to parse JSON response:', e);
                return null;
            });
            
            console.log('Response data:', data);

            if (!response.ok) {
                throw new Error(data?.message || 'Failed to update pet');
            }

            fetchPets();
            setEditingPet(null);
            setError(''); 
        } catch (err) {
            console.error('Error updating pet:', err);
            setError(err.message || 'Failed to update pet');
        }
    };

    const handleDeletePet = async (petId) => {
        try {
            const response = await fetch(`http://localhost:8888/user/pets/delete/${petId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Failed to delete pet');
            
            fetchPets();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="pets-container">
            <h2>My Pets</h2>
            {error && <div className="error-message">{error}</div>}
            
            <button 
                className="add-pet-button"
                onClick={() => setIsAddingPet(!isAddingPet)}
            >
                {isAddingPet ? 'Cancel' : 'Add New Pet'}
            </button>

            {isAddingPet && (
                <form className="add-pet-form" onSubmit={handleAddPet}>
                    <input
                        type="text"
                        placeholder="Pet Name"
                        value={newPet.name}
                        onChange={e => setNewPet({...newPet, name: e.target.value})}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Age"
                        value={newPet.age}
                        onChange={e => setNewPet({...newPet, age: e.target.value})}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Breed"
                        value={newPet.breed}
                        onChange={e => setNewPet({...newPet, breed: e.target.value})}
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={newPet.description}
                        onChange={e => setNewPet({...newPet, description: e.target.value})}
                        required
                    />
                    <button type="submit">Add Pet</button>
                </form>
            )}

            <div className="pets-list">
                {pets.map(pet => (
                    <div key={pet.id} className="pet-card">
                        {editingPet && editingPet.id === pet.id ? (
                            <form className="edit-pet-form" onSubmit={handleUpdatePet}>
                                <input
                                    type="text"
                                    value={editingPet.name}
                                    onChange={e => setEditingPet({...editingPet, name: e.target.value})}
                                    required
                                />
                                <input
                                    type="number"
                                    value={editingPet.age}
                                    onChange={e => setEditingPet({...editingPet, age: e.target.value})}
                                    required
                                />
                                <input
                                    type="text"
                                    value={editingPet.breed}
                                    onChange={e => setEditingPet({...editingPet, breed: e.target.value})}
                                    required
                                />
                                <textarea
                                    value={editingPet.description}
                                    onChange={e => setEditingPet({...editingPet, description: e.target.value})}
                                    required
                                />
                                <div className="edit-buttons">
                                    <button type="submit">Save</button>
                                    <button type="button" onClick={() => setEditingPet(null)}>Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <h3>{pet.name}</h3>
                                <p>Age: {pet.age}</p>
                                <p>Breed: {pet.breed}</p>
                                <p>Description: {pet.description}</p>
                                <div className="pet-actions">
                                    <button onClick={() => setEditingPet(pet)}>Edit</button>
                                    <button onClick={() => handleDeletePet(pet.id)}>Delete</button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PetsList;
