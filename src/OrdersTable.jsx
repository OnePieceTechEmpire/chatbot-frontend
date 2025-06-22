import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import './AdminPanel.css';

function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedSessionId, setSelectedSessionId] = useState(null);
const [chatMessages, setChatMessages] = useState([]);
const [chatVisible, setChatVisible] = useState(false);
const [chatLoading, setChatLoading] = useState(false);

const handleOpenChat = async (sessionId) => {
  setSelectedSessionId(sessionId);
  setChatVisible(true);
  setChatLoading(true);

  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('timestamp', { ascending: true });

  if (error) {
    console.error('Error fetching chat messages:', error);
    setChatMessages([]);
  } else {
    setChatMessages(data);
  }

  setChatLoading(false);
};

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('chat_orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error('Error fetching orders:', error);
    else setOrders(data);
  };

  const filteredOrders = orders.filter(order => {
    const matchesDelivery =
      filter === 'all' || (order.delivery_method && order.delivery_method.toLowerCase() === filter);
    const matchesStatus =
      statusFilter === 'all' || (order.status && order.status === statusFilter);
    const matchesSearch = !searchTerm || (
      (order.name && order.name.toLowerCase().includes(searchTerm)) ||
      (order.phone_number && order.phone_number.includes(searchTerm))
    );
    return matchesDelivery && matchesStatus && matchesSearch;
  });

  const getStatusStyle = (status) => {
    if (status === 'completed') return 'status completed';
    if (status && status.includes('awaiting')) return 'status awaiting';
    return 'status pending';
  };

  return (
<div className="admin-wrapper">
  {/* Sticky Header */}
  <header className="admin-header">
    <div className="logo-area">
      <img src="/your-logo.png" alt="Logo" className="logo" />
      <h1>YourCompany</h1>
    </div>

    <div className="user-area">
      <button className="logout-btn">Logout</button>
    </div>
      </header>


      {/* Filter Bar */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by name or phone"
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
        />

        <select onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Delivery</option>
          <option value="postage">Postage</option>
          <option value="walkin">Walk-in</option>
          <option value="booking">Booking</option>
        </select>

        <select onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="pending_delivery_info">Pending Delivery</option>
          <option value="details_received">Details Received</option>
          <option value="awaiting_payment_confirmation">Awaiting Payment</option>
          <option value="completed">Completed</option>
        </select>

        <div className="summary-box">
          <span>Total: {orders.length}</span>
          <span>Completed: {orders.filter(o => o.status === 'completed').length}</span>
          <span>Pending: {orders.filter(o => o.status !== 'completed').length}</span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Model</th>
              <th>Color</th>
              <th>Storage</th>
              <th>Price (RM)</th>
              <th>Delivery</th>
              <th>Address</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Call</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr key={order.id}>
                <td>{index + 1}</td>
                <td>{order.model}</td>
                <td>{order.color}</td>
                <td>{order.storage}</td>
                <td><strong>RM{order.price}</strong></td>
                <td>{order.delivery_method}</td>
                <td>{order.address}</td>
                <td>{order.name}</td>
                <td>{order.phone_number}</td>
                <td><span className={getStatusStyle(order.status)}>{order.status}</span></td>
<td>
  <button onClick={() => handleOpenChat(order.session_id)}>💬</button>
</td>
              </tr>
            ))}
          </tbody>
          {chatVisible && (
  <div className="chat-modal">
    <div className="chat-header">
      <h3>Chat History (Session: {selectedSessionId})</h3>
      <button onClick={() => setChatVisible(false)}>✖ Close</button>
    </div>

    <div className="chat-box">
      {chatLoading ? (
        <p>Loading chat...</p>
      ) : chatMessages.length === 0 ? (
        <p>No messages found for this session.</p>
      ) : (
        chatMessages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-message ${msg.sender === 'user' ? 'user' : 'bot'}`}
          >
            <div className="bubble">
              <strong>{msg.sender === 'user' ? '🧑 User' : '🤖 Bot'}:</strong>
              <p>{msg.message}</p>
              <small>{new Date(msg.timestamp).toLocaleString()}</small>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
)}
        </table>
        

        
      </div>
      
    </div>
    
  );
  
}



export default OrdersTable;
