'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ElderlySupport from './ElderlySupport';

export default function BookingForm({ categoryId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Auto-Fetched Category, Problems & User Profile Data
  const [categoryData, setCategoryData] = useState(null);
  const [problemsList, setProblemsList] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    customer_id: null,
    full_name: '',
    email: '',
    phone: ''
  });

  // Form Selections
  const [selectedProblemId, setSelectedProblemId] = useState('');
  const [isCustomProblem, setIsCustomProblem] = useState(false);
  const [issueDescription, setIssueDescription] = useState('');

  // Emergency Toggle
  const [emergencyFlag, setEmergencyFlag] = useState(false);
  const [emergencyReason, setEmergencyReason] = useState('');

  // Calculated Pricing Summary
  const [summaryData, setSummaryData] = useState(null);

  // Address Fields
  const [address, setAddress] = useState({
    houseNumber: '',
    apartmentName: '',
    street: '',
    area: '',
    city: 'Mangalore',
    pincode: ''
  });

  // Schedule Fields
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [anytimeService, setAnytimeService] = useState(false);

//   // 1. FETCH CATEGORY, PROBLEMS & CUSTOMER PROFILE ON LOAD
//   useEffect(() => {
//   async function fetchInitData() {
//     if (!categoryId) return;
//     setLoading(true);
//     setError('');

//     const token = localStorage.getItem('token') || localStorage.getItem('accessToken');

//     if (!token) {
//       setError('You are not logged in. Please log in as a Customer.');
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch(`http://localhost:5000/api/customer/booking-init/${categoryId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const result = await res.json();

//       if (res.status === 403) {
//         setError('Access denied: Your account does not have Customer permissions.');
//         return;
//       }

//       if (result.success && result.data) {
//         setCategoryData(result.data.category);
//         setProblemsList(result.data.problems || []);

//         if (result.data.customer) {
//           setCustomerInfo({
//             full_name: result.data.customer.full_name || '',
//             email: result.data.customer.email || '',
//             phone: result.data.customer.phone || ''
//           });

//           if (result.data.customer.address) {
//             setAddress((prev) => ({ ...prev, street: result.data.customer.address }));
//           }
//         }
//       } else {
//         setError(result.message || 'Failed to fetch category information.');
//       }
//     } catch (err) {
//       setError('Error connecting to server.');
//     } finally {
//       setLoading(false);
//     }
//   }

//   fetchInitData();
// }, [categoryId]);
  useEffect(() => {
    async function fetchInitData() {
      if (!categoryId) return;
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');

      try {
        const res = await fetch(`http://localhost:5000/api/customer/booking-init/${categoryId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await res.json();

        if (result.success && result.data) {
          setCategoryData(result.data.category);
          setProblemsList(result.data.problems || []);

          if (result.data.customer) {
              console.log("CUSTOMER DATA FROM BACKEND:", result.data.customer);
            setCustomerInfo({
              customer_id: result.data.customer.user_id, 
              full_name: result.data.customer.full_name || '',
              email: result.data.customer.email || '',
              phone: result.data.customer.phone || ''
            });

            if (result.data.customer.address) {
              setAddress((prev) => ({ ...prev, street: result.data.customer.address }));
            }
          }
        } else {
          setError(result.message || 'Failed to fetch category information.');
        }
      } catch (err) {
        setError('Error connecting to server.');
      } finally {
        setLoading(false);
      }
    }

    fetchInitData();
  }, [categoryId]);

  // 2. LIVE PRICING SUMMARY RECALCULATION
  useEffect(() => {
    async function fetchSummary() {
      if (!selectedProblemId && !isCustomProblem) {
        setSummaryData(null);
        return;
      }

      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');

      try {
        const res = await fetch('http://localhost:5000/api/customer/bookings/summary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({

            problemId: selectedProblemId ? Number(selectedProblemId) : null,
            isCustomProblem,
            emergencyFlag
          })
        });

        const result = await res.json();
        if (result.success) {
          setSummaryData(result.data);
        }
      } catch (err) {
        console.error('Error fetching summary:', err);
      }
    }

    fetchSummary();
  }, [selectedProblemId, isCustomProblem, emergencyFlag]);

  // 3. SUBMIT BOOKING TO BACKEND
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');

    const payload = {
        customerId: customerInfo.customer_id,
      categoryId: Number(categoryId),
      problemId: isCustomProblem || !selectedProblemId ? null : Number(selectedProblemId),
      isCustomProblem,
      customProblemDescription: isCustomProblem ? (issueDescription || '').substring(0, 90) : null,
      issueDescription: (issueDescription || '').substring(0, 90) || null,
      emergencyFlag,
      emergencyReason: emergencyFlag ? (emergencyReason || '').substring(0, 90) : null,
      preferredDate: anytimeService ? null : (preferredDate || null),
      preferredTime: anytimeService ? null : (preferredTime || null),
      anytimeService,
      houseNumber: address.houseNumber ? String(address.houseNumber).substring(0, 50) : null,
      apartmentName: address.apartmentName ? String(address.apartmentName).substring(0, 90) : null,
      street: (address.street || '').substring(0, 90),
      area: (address.area || '').substring(0, 90),
      city: (address.city || 'Mangalore').substring(0, 90),
      pincode: (address.pincode || '').substring(0, 10)
    };
    console.log("BOOKING PAYLOAD:", payload);
    try {
      const res = await fetch('http://localhost:5000/api/customer/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (result.success) {
        const createdBookingId = result.data?.bookingId || result.booking?.booking_id;
        setSuccessMsg(` Booking created successfully! Booking ID: #${createdBookingId}`);
        
        setTimeout(() => {
          router.push(`/customer/bookingConfirmation?bookingId=${createdBookingId}`);
        }, 1200);
      } else {
        setError(result.message || 'Failed to submit booking.');
      }
    } catch (err) {
      setError('Network error. Unable to process booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ELDERLY & SENIOR ASSISTANCE BANNER CARD */}
      <ElderlySupport dispatcherPhone="+919876543210" />

      <form onSubmit={handleSubmitBooking} className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100 space-y-6">
        {/* HEADER */}
        <div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Service Booking</span>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">
            {categoryData?.category_name || 'Book Service'}
          </h2>
        </div>

        {/* ERROR & SUCCESS MESSAGES */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl text-sm font-medium">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-2xl text-sm font-bold">
            {successMsg}
          </div>
        )}

        {/* READ-ONLY CUSTOMER INFORMATION */}
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Customer Contact Info (Read Only)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div>
              <label className="text-xs text-gray-500 font-semibold">Name</label>
              <input
                type="text"
                readOnly
                value={customerInfo.full_name}
                className="w-full bg-gray-200 text-gray-700 p-2.5 rounded-xl text-sm font-medium border border-gray-300 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold">Phone</label>
              <input
                type="text"
                readOnly
                value={customerInfo.phone}
                className="w-full bg-gray-200 text-gray-700 p-2.5 rounded-xl text-sm font-medium border border-gray-300 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold">Email</label>
              <input
                type="email"
                readOnly
                value={customerInfo.email}
                className="w-full bg-gray-200 text-gray-700 p-2.5 rounded-xl text-sm font-medium border border-gray-300 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* PROBLEM SELECTION LIST */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-gray-700">Select Specific Issue:</p>
          
          {problemsList.map((prob) => (
            <label
              key={prob.problem_id}
              className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                selectedProblemId === prob.problem_id && !isCustomProblem
                  ? 'border-orange-500 bg-orange-50/40'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="problem"
                  value={prob.problem_id}
                  checked={selectedProblemId === prob.problem_id && !isCustomProblem}
                  onChange={() => {
                    setSelectedProblemId(prob.problem_id);
                    setIsCustomProblem(false);
                  }}
                  className="accent-orange-500 w-4 h-4"
                />
                <span className="font-medium text-gray-800">{prob.problem_name}</span>
              </div>
              <span className="font-bold text-orange-600">
                {prob.fixed_price ? `₹${prob.fixed_price}` : 'Inspection Required'}
              </span>
            </label>
          ))}

          {/* CUSTOM PROBLEM OPTION */}
          <label
            className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
              isCustomProblem ? 'border-orange-500 bg-orange-50/40' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                name="problem"
                value="custom"
                checked={isCustomProblem}
                onChange={() => {
                  setSelectedProblemId('');
                  setIsCustomProblem(true);
                }}
                className="accent-orange-500 w-4 h-4"
              />
              <span className="font-medium text-gray-800">Other / Custom Issue</span>
            </div>
            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">On-Site Quote</span>
          </label>
        </div>

        {/* ISSUE DESCRIPTION */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-600 uppercase">Issue Description</label>
          <textarea
            placeholder={isCustomProblem ? "Describe custom problem in detail (Required)..." : "Provide any additional details about the issue..."}
            value={issueDescription}
            onChange={(e) => setIssueDescription(e.target.value)}
            rows={3}
            required={isCustomProblem}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:border-orange-500"
          />
          {isCustomProblem && (
            <p className="text-xs text-orange-600 font-medium">
              Final price will be decided after technician inspection.
            </p>
          )}
        </div>

        {/* EMERGENCY TOGGLE */}
        <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={emergencyFlag}
              onChange={(e) => setEmergencyFlag(e.target.checked)}
              className="w-4 h-4 accent-orange-500"
            />
            <span className="font-bold text-amber-900 text-sm">Emergency Booking (Priority Dispatch)</span>
          </label>

          {emergencyFlag && (
            <input
              type="text"
              placeholder="Reason for emergency (Required)..."
              value={emergencyReason}
              onChange={(e) => setEmergencyReason(e.target.value)}
              required
              className="w-full bg-white border border-amber-300 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:border-orange-500"
            />
          )}
        </div>

        {/* LIVE PRICING SUMMARY DISPLAY */}
        {summaryData && (
          <div className="p-4 bg-gray-900 text-white rounded-2xl space-y-2">
            <h4 className="text-xs font-bold uppercase text-orange-400 tracking-wider">Estimated Pricing Summary</h4>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Base Price:</span>
              <span className="font-semibold">{summaryData.basePrice !== null ? `₹${summaryData.basePrice}` : 'To be decided after inspection'}</span>
            </div>
            {summaryData.emergencyCharge > 0 && (
              <div className="flex justify-between text-sm text-amber-400">
                <span>Emergency Charge:</span>
                <span className="font-semibold">+₹{summaryData.emergencyCharge}</span>
              </div>
            )}
            {summaryData.advanceAmount > 0 && (
              <div className="flex justify-between text-sm text-green-400">
                <span>Advance Payment:</span>
                <span className="font-semibold">₹{summaryData.advanceAmount}</span>
              </div>
            )}
            <div className="pt-2 border-t border-gray-800 flex justify-between text-base font-bold text-orange-400">
              <span>Estimated Grand Total:</span>
              <span>{summaryData.grandTotal !== null ? `₹${summaryData.grandTotal}` : 'Pending Inspection'}</span>
            </div>
            <p className="text-xs text-gray-400 italic pt-1">{summaryData.priceMessage}</p>
          </div>
        )}

        {/* DETAILED ADDRESS INPUTS */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-gray-800">Service Location</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <input
              type="text"
              placeholder="House / Door No."
              value={address.houseNumber}
              onChange={(e) => setAddress({ ...address, houseNumber: e.target.value })}
              className="bg-gray-50 p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
            />
            <input
              type="text"
              placeholder="Apartment / Building"
              value={address.apartmentName}
              onChange={(e) => setAddress({ ...address, apartmentName: e.target.value })}
              className="bg-gray-50 p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
            />
            <input
              type="text"
              placeholder="Street *"
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              required
              className="bg-gray-50 p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
            />
            <input
              type="text"
              placeholder="Area / Landmark *"
              value={address.area}
              onChange={(e) => setAddress({ ...address, area: e.target.value })}
              required
              className="bg-gray-50 p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
            />
            <input
              type="text"
              placeholder="City *"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              required
              className="bg-gray-50 p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
            />
            <input
              type="text"
              placeholder="Pincode *"
              value={address.pincode}
              onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
              required
              className="bg-gray-50 p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* SCHEDULE */}
        <div className="space-y-3 pt-2">
          <label className="text-sm font-bold text-gray-800">Preferred Schedule</label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="anytime"
              checked={anytimeService}
              onChange={(e) => setAnytimeService(e.target.checked)}
              className="accent-orange-500 w-4 h-4"
            />
            <label htmlFor="anytime" className="text-sm text-gray-700">Anytime Service (As soon as available)</label>
          </div>

          {!anytimeService && (
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="bg-gray-50 p-3 border border-gray-200 rounded-xl text-sm"
              />
              <input
                type="time"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="bg-gray-50 p-3 border border-gray-200 rounded-xl text-sm"
              />
            </div>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading || (!selectedProblemId && !isCustomProblem)}
          className="w-full py-4 bg-black hover:bg-orange-500 text-white font-bold rounded-xl transition shadow-lg disabled:opacity-50"
        >
          {loading ? 'Submitting Request...' : 'Book Service Now'}
        </button>
      </form>
    </div>
  );
}