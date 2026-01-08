import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  UserIcon,
  TicketIcon,
  ArrowPathIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const SeatViewer = () => {
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    seatNumber: '',
    row: '',
    column: '',
    type: 'standard',
    price: '',
    status: 'available'
  });

  // Fetch all seat data
  useEffect(() => {
    fetchSeatData();
  }, []);

  const fetchSeatData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/seats');
      const seatData = response.data.data;
      
      // Transform seat data to include status
      const processedSeats = seatData.map(seat => ({
        ...seat,
        status: seat.status || 'available'
      }));
      
      setSeats(processedSeats);
    } catch (error) {
      console.error('Error fetching seat data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get seat data by ID
  const getSeatData = (seatId) => {
    return seats.find(seat => seat._id === seatId);
  };

  // Update seat status
  const updateSeatStatus = async (seatId, newStatus) => {
    try {
      const response = await axios.put(`/api/seats/${seatId}`, {
        status: newStatus
      });
      
      if (response.data.success) {
        // Update local state
        setSeats(prevSeats => 
          prevSeats.map(seat => 
            seat._id === seatId ? { ...seat, status: newStatus } : seat
          )
        );
        
        // If this seat was selected, update it too
        if (selectedSeat && selectedSeat._id === seatId) {
          setSelectedSeat({ ...selectedSeat, status: newStatus });
        }
        
        return { success: true, seat: response.data.seat };
      }
    } catch (error) {
      console.error('Error updating seat status:', error);
      return { success: false, error: error.message };
    }
  };

  // Update seat details
  const updateSeatDetails = async (seatId, updates) => {
    try {
      const response = await axios.put(`/api/seats/${seatId}`, updates);
      
      if (response.data.success) {
        // Update local state
        setSeats(prevSeats => 
          prevSeats.map(seat => 
            seat._id === seatId ? { ...seat, ...updates } : seat
          )
        );
        
        // Update selected seat if it's the same
        if (selectedSeat && selectedSeat._id === seatId) {
          setSelectedSeat({ ...selectedSeat, ...updates });
        }
        
        return { success: true };
      }
    } catch (error) {
      console.error('Error updating seat details:', error);
      return { success: false, error: error.message };
    }
  };

  // Handle seat selection
  const handleSeatClick = (seat) => {
    if (selectedSeat && selectedSeat._id === seat._id) {
      setSelectedSeat(null);
    } else {
      setSelectedSeat(seat);
    }
  };


  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'row' || name === 'column' 
        ? parseFloat(value) || '' 
        : value
    }));
  };

  // Handle edit form submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (selectedSeat) {
      await updateSeatDetails(selectedSeat._id, editForm);
    }
  };

  // Quick status change buttons
  const quickStatusChange = async (status) => {
    if (selectedSeat) {
      const result = await updateSeatStatus(selectedSeat._id, status);
      if (result.success) {
        alert(`Seat status changed to ${status}`);
      }
    }
  };

  // Render seat card
  const renderSeatCard = (seat) => {
    const statusColors = {
      available: 'bg-green-100 text-green-800 border-green-300',
      booked: 'bg-red-100 text-red-800 border-red-300',
      reserved: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      maintenance: 'bg-gray-100 text-gray-800 border-gray-300'
    };

    return (
      <div
        key={seat._id}
        className={`p-4 rounded-lg border cursor-pointer transition-all ${
          selectedSeat?._id === seat._id 
            ? 'ring-2 ring-blue-500 bg-blue-50' 
            : 'hover:bg-gray-50'
        } ${statusColors[seat.status] || 'bg-gray-100'}`}
        onClick={() => handleSeatClick(seat)}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg">{seat.seatNumber}</h3>
            <p className="text-sm text-gray-600">
              Row {seat.row}, Column {seat.column}
            </p>
            <div className="flex items-center mt-2 space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                seat.status === 'available' ? 'bg-green-200 text-green-800' :
                seat.status === 'booked' ? 'bg-red-200 text-red-800' :
                seat.status === 'reserved' ? 'bg-yellow-200 text-yellow-800' :
                'bg-gray-200 text-gray-800'
              }`}>
                {seat.status}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                seat.type === 'vip' ? 'bg-purple-200 text-purple-800' :
                seat.type === 'premium' ? 'bg-yellow-200 text-yellow-800' :
                'bg-blue-200 text-blue-800'
              }`}>
                {seat.type}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg">${seat.price || '0'}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                openEditModal(seat);
              }}
              className="mt-2 p-1 text-gray-500 hover:text-blue-600"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ArrowPathIcon className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading seat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Seat Management</h2>
          <p className="text-gray-600">View and update seat status</p>
        </div>
        <button
          onClick={fetchSeatData}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
        >
          <ArrowPathIcon className="w-5 h-5 mr-2" />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="flex items-center">
            <TicketIcon className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Seats</p>
              <p className="text-2xl font-bold text-gray-800">{seats.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircleIcon className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-2xl font-bold text-gray-800">
                {seats.filter(s => s.status === 'available').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg">
          <div className="flex items-center">
            <XCircleIcon className="w-8 h-8 text-red-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Booked</p>
              <p className="text-2xl font-bold text-gray-800">
                {seats.filter(s => s.status === 'booked').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
          <div className="flex items-center">
            <UserIcon className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Selected</p>
              <p className="text-2xl font-bold text-gray-800">
                {selectedSeat ? 1 : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Seats List */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">All Seats</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto p-2">
              {seats.map(seat => renderSeatCard(seat))}
            </div>
          </div>
        </div>

        {/* Right: Selected Seat Details */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            {selectedSeat ? (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Selected Seat Details</h3>
                
                {/* Seat Info */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Seat Number:</span>
                    <span className="font-bold">{selectedSeat.seatNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Location:</span>
                    <span>Row {selectedSeat.row}, Col {selectedSeat.column}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Type:</span>
                    <span className="capitalize">{selectedSeat.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Price:</span>
                    <span className="font-bold text-blue-600">${selectedSeat.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedSeat.status === 'available' ? 'bg-green-100 text-green-800' :
                      selectedSeat.status === 'booked' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedSeat.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Seat ID:</span>
                    <span className="text-xs text-gray-500">{selectedSeat._id}</span>
                  </div>
                </div>

                {/* Quick Status Change */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Quick Status Change:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => quickStatusChange('available')}
                      className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm"
                    >
                      Mark Available
                    </button>
                    <button
                      onClick={() => quickStatusChange('booked')}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
                    >
                      Mark Booked
                    </button>
                    <button
                      onClick={() => quickStatusChange('reserved')}
                      className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 text-sm"
                    >
                      Mark Reserved
                    </button>
                    <button
                      onClick={() => quickStatusChange('maintenance')}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                    >
                      Maintenance
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => openEditModal(selectedSeat)}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                  >
                    <PencilIcon className="w-5 h-5 mr-2" />
                    Edit Seat Details
                  </button>
                  
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(selectedSeat, null, 2));
                      alert('Seat data copied to clipboard!');
                    }}
                    className="w-full py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Copy Seat Data
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 text-center">
                <TicketIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Seat Selected</h3>
                <p className="text-gray-500">Click on a seat to view and edit its details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedSeat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit Seat: {selectedSeat.seatNumber}</h3>
            
            <form onSubmit={handleEditSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Seat Number
                  </label>
                  <input
                    type="text"
                    name="seatNumber"
                    value={editForm.seatNumber}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Row
                    </label>
                    <input
                      type="number"
                      name="row"
                      value={editForm.row}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Column
                    </label>
                    <input
                      type="number"
                      name="column"
                      value={editForm.column}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    name="type"
                    value={editForm.type}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="standard">Standard</option>
                    <option value="vip">VIP</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={editForm.price}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={editForm.status}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                    <option value="reserved">Reserved</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatViewer;