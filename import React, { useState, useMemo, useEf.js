import React, { useState, useMemo, useEffect } from 'react';

const INITIAL_DOCTORS = [
  {
    id: 'doc-1',
    name: 'Dr. Sarah Jenkins',
    title: 'Senior Cosmetic Dermatologist',
    specialty: 'Laser & Aesthetic Procedures',
    rating: '4.9',
    reviews: 128,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=250&q=80',
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    hours: '09:00 - 17:00',
    breakTime: '13:00 - 14:00',
    color: 'teal'
  },
  {
    id: 'doc-2',
    name: 'Dr. Aris Thorne',
    title: 'Dermatologic Surgeon',
    specialty: 'Surgical & Scar Revision',
    rating: '4.8',
    reviews: 94,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=250&q=80',
    workingDays: ['Mon', 'Wed', 'Thu', 'Fri', 'Sat'],
    hours: '08:30 - 16:30',
    breakTime: '12:30 - 13:30',
    color: 'indigo'
  },
  {
    id: 'doc-3',
    name: 'Dr. Maya Patel',
    title: 'General & Pediatric Dermatologist',
    specialty: 'Acne, Eczema & General Skin Health',
    rating: '4.95',
    reviews: 210,
    avatar: 'https://images.unsplash.com/photo-1594824813566-78a933f2b602?auto=format&fit=crop&w=250&q=80',
    workingDays: ['Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    hours: '09:00 - 17:00',
    breakTime: '13:00 - 14:00',
    color: 'cyan'
  }
];

const INITIAL_SERVICES = [
  {
    id: 'srv-1',
    name: 'CO₂ Fractional Laser',
    category: 'Laser Therapy',
    durationMinutes: 60,
    bufferMinutes: 15,
    depositRequired: 100,
    totalPrice: 350,
    requiresConsent: true,
    requiresIntake: true,
    description: 'Deep tissue resurfacing for acne scars, wrinkles, and texture correction.',
    prepInstructions: 'Avoid sun exposure and retinoids 5 days prior to treatment.'
  },
  {
    id: 'srv-2',
    name: 'PRP Hair & Skin Therapy',
    category: 'Regenerative',
    durationMinutes: 45,
    bufferMinutes: 10,
    depositRequired: 75,
    totalPrice: 280,
    requiresConsent: true,
    requiresIntake: true,
    description: 'Platelet-Rich Plasma micro-injections for hair rejuvenation & skin glow.',
    prepInstructions: 'Drink plenty of water before session. Avoid NSAIDs.'
  },
  {
    id: 'srv-3',
    name: 'Dermatology Consultation',
    category: 'Quick Check-up',
    durationMinutes: 15,
    bufferMinutes: 5,
    depositRequired: 25,
    totalPrice: 90,
    requiresConsent: false,
    requiresIntake: true,
    description: 'Comprehensive physical examination for moles, rashes, acne, or general concerns.',
    prepInstructions: 'Remove facial makeup prior to appointment if consulting for face.'
  },
  {
    id: 'srv-4',
    name: 'RF Microneedling',
    category: 'Laser & Energy',
    durationMinutes: 45,
    bufferMinutes: 10,
    depositRequired: 60,
    totalPrice: 250,
    requiresConsent: true,
    requiresIntake: true,
    description: 'Radiofrequency energy combined with microneedling for collagen skin tightening.',
    prepInstructions: 'Arrive 20 mins early for topical numbing cream application.'
  },
  {
    id: 'srv-5',
    name: 'Medical Chemical Peel',
    category: 'Peels & Glow',
    durationMinutes: 30,
    bufferMinutes: 5,
    depositRequired: 30,
    totalPrice: 140,
    requiresConsent: true,
    requiresIntake: true,
    description: 'Targeted exfoliation for hyperpigmentation, melasma, and active breakouts.',
    prepInstructions: 'Discontinue exfoliating acids 3 days prior.'
  }
];

const INITIAL_APPOINTMENTS = [
  {
    id: 'apt-101',
    patientName: 'Emma Watson',
    patientPhone: '+1 (555) 019-2834',
    patientEmail: 'emma.w@example.com',
    doctorId: 'doc-1',
    serviceId: 'srv-1',
    date: '2026-09-09',
    timeSlot: '09:00',
    status: 'In-Queue',
    queuePosition: 1,
    depositPaid: true,
    depositAmount: 100,
    intakeCompleted: true,
    consentSigned: true,
    aiTriageNote: 'Severe acne scarring on checks. Recommended CO₂ Laser 60min slot with 15min buffer.',
    createdDate: '2026-09-02'
  },
  {
    id: 'apt-102',
    patientName: 'Michael Chen',
    patientPhone: '+1 (555) 234-5678',
    patientEmail: 'm.chen@example.com',
    doctorId: 'doc-1',
    serviceId: 'srv-2',
    date: '2026-09-09',
    timeSlot: '10:15',
    status: 'Confirmed',
    queuePosition: 2,
    depositPaid: true,
    depositAmount: 75,
    intakeCompleted: true,
    consentSigned: true,
    aiTriageNote: 'Pattern hair thinning stage II. Cleared for PRP injection.',
    createdDate: '2026-09-03'
  },
  {
    id: 'apt-103',
    patientName: 'Sophia Rodriguez',
    patientPhone: '+1 (555) 876-5432',
    patientEmail: 'sophia.r@example.com',
    doctorId: 'doc-3',
    serviceId: 'srv-3',
    date: '2026-09-09',
    timeSlot: '09:30',
    status: 'Completed',
    queuePosition: null,
    depositPaid: true,
    depositAmount: 25,
    intakeCompleted: true,
    consentSigned: false,
    aiTriageNote: 'Routine checkup for eczema flare-up. Prescribed topical anti-inflammatory.',
    createdDate: '2026-09-04'
  },
  {
    id: 'apt-104',
    patientName: 'David Miller',
    patientPhone: '+1 (555) 345-6789',
    patientEmail: 'dmiller@example.com',
    doctorId: 'doc-2',
    serviceId: 'srv-4',
    date: '2026-09-10',
    timeSlot: '11:00',
    status: 'Confirmed',
    queuePosition: null,
    depositPaid: true,
    depositAmount: 60,
    intakeCompleted: true,
    consentSigned: true,
    aiTriageNote: 'Mild jawline laxity and deep pores. RF Microneedling booked.',
    createdDate: '2026-09-05'
  }
];

const INITIAL_WAITING_LIST = [
  {
    id: 'wait-1',
    patientName: 'Jessica Taylor',
    phone: '+1 (555) 998-1122',
    serviceId: 'srv-1',
    preferredDoctorId: 'doc-1',
    preferredDate: '2026-09-09',
    notes: 'Urgent laser spot correction before wedding event next week.',
    requestedAt: '2026-09-07'
  },
  {
    id: 'wait-2',
    patientName: 'Liam O’Connor',
    phone: '+1 (555) 776-3344',
    serviceId: 'srv-2',
    preferredDoctorId: 'doc-2',
    preferredDate: '2026-09-10',
    notes: 'Available on short notice for any PRP spot.',
    requestedAt: '2026-09-08'
  }
];

const Icons = {
  Calendar: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
  ),
  User: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
  ),
  Stethoscope: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V4a1 1 0 012 0v4a1 1 0 002 0V4a1 1 0 012 0v4a3 3 0 01-3 3z"/></svg>
  ),
  ShieldCheck: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
  ),
  Brain: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
  ),
  Clock: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
  ),
  CheckCircle: () => (
    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
  ),
  AlertTriangle: () => (
    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
  ),
  Plus: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
  ),
  Sparkles: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
  ),
  Queue: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
  ),
  TrendingUp: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
  )
};

export default function App() {
  const [activeRole, setActiveRole] = useState('Patient'); // 'Patient' | 'Doctor' | 'Receptionist' | 'Admin'
  const [doctors, setDoctors] = useState(INITIAL_DOCTORS);
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [waitingList, setWaitingList] = useState(INITIAL_WAITING_LIST);
  const [notification, setNotification] = useState(null);

  // Helper to show transient pop-up messages
  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col">
      {/* Top Bar / Navigation Header */}
      <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Clinic Brand */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-teal-400 to-cyan-500 p-2.5 rounded-xl text-slate-950 font-bold shadow-md">
              <Icons.Sparkles />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-teal-300 via-cyan-200 to-white bg-clip-text text-transparent">
                DermoCare
              </span>
              <span className="hidden sm:inline-block text-xs text-slate-400 ml-2 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                SRS v1.0 System
              </span>
            </div>
          </div>

          {/* Role Switcher Pills */}
          <div className="flex items-center space-x-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-400 px-2 font-medium hidden md:inline">View Mode:</span>
            {[
              { id: 'Patient', label: 'Patient Portal', icon: Icons.User },
              { id: 'Doctor', label: 'Doctor Hub', icon: Icons.Stethoscope },
              { id: 'Receptionist', label: 'Reception Desk', icon: Icons.Queue },
              { id: 'Admin', label: 'Admin & Analytics', icon: Icons.TrendingUp }
            ].map((role) => {
              const Icon = role.icon;
              const isActive = activeRole === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setActiveRole(role.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  <Icon />
                  <span>{role.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Global Notification Toast */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce">
          <div className={`flex items-center space-x-2 px-4 py-3 rounded-xl shadow-xl text-white text-sm font-medium ${
            notification.type === 'error' ? 'bg-rose-600' : 'bg-teal-600'
          }`}>
            <Icons.CheckCircle />
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main Role-Based Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {activeRole === 'Patient' && (
          <PatientPortalView
            doctors={doctors}
            services={services}
            appointments={appointments}
            setAppointments={setAppointments}
            waitingList={waitingList}
            setWaitingList={setWaitingList}
            showToast={showToast}
          />
        )}

        {activeRole === 'Doctor' && (
          <DoctorHubView
            doctors={doctors}
            setDoctors={setDoctors}
            services={services}
            appointments={appointments}
            setAppointments={setAppointments}
            showToast={showToast}
          />
        )}

        {activeRole === 'Receptionist' && (
          <ReceptionDeskView
            doctors={doctors}
            services={services}
            appointments={appointments}
            setAppointments={setAppointments}
            waitingList={waitingList}
            setWaitingList={setWaitingList}
            showToast={showToast}
          />
        )}

        {activeRole === 'Admin' && (
          <AdminAnalyticsView
            doctors={doctors}
            setDoctors={setDoctors}
            services={services}
            setServices={setServices}
            appointments={appointments}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-4 px-6 text-center">
        DermoCare Intelligent Slot Reservation System • Dynamic Buffers • AI Triage • Digital Consent
      </footer>
    </div>
  );
}

function PatientPortalView({ doctors, services, appointments, setAppointments, waitingList, setWaitingList, showToast }) {
  const [activeTab, setActiveTab] = useState('book'); // 'book' | 'aiTriage' | 'myQueue' | 'journey'
  
  // Dynamic Booking Form State
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || '');
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState('2026-09-09');
  const [selectedSlot, setSelectedSlot] = useState('');
  
  // Patient Details
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');

  // AI Pre-Consultation State
  const [aiStep, setAiStep] = useState(1);
  const [skinConcern, setSkinConcern] = useState('Acne & Scarring');
  const [durationWeeks, setDurationWeeks] = useState('4');
  const [severity, setSeverity] = useState('Moderate');
  const [imageUploaded, setImageUploaded] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // Digital Consent Modal
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [medicalIntakeHistory, setMedicalIntakeHistory] = useState({
    allergies: 'None',
    roaccutane: 'No',
    pregnant: 'No',
    sunExposure: 'No'
  });

  const selectedService = services.find((s) => s.id === selectedServiceId);
  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);

  // Dynamic Slot Calculation with Buffer Logic (BR-01, BR-02, BR-06)
  const availableSlots = useMemo(() => {
    if (!selectedService || !selectedDoctor) return [];
    
    // Base times: 09:00 to 16:30 in intervals calculated from duration + buffer
    const durationPlusBuffer = selectedService.durationMinutes + selectedService.bufferMinutes;
    const slots = [];
    
    let startMinutes = 9 * 60; // 09:00 AM
    const endMinutes = 16 * 60;  // 04:00 PM
    const breakStart = 13 * 60;  // 01:00 PM
    const breakEnd = 14 * 60;    // 02:00 PM

    while (startMinutes + selectedService.durationMinutes <= endMinutes) {
      // Check break time
      if (startMinutes >= breakStart && startMinutes < breakEnd) {
        startMinutes = breakEnd;
        continue;
      }

      const hours = Math.floor(startMinutes / 60);
      const mins = startMinutes % 60;
      const timeString = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;

      // Check existing booking overlap
      const isBooked = appointments.some(
        (apt) =>
          apt.doctorId === selectedDoctorId &&
          apt.date === selectedDate &&
          apt.timeSlot === timeString &&
          apt.status !== 'Cancelled'
      );

      slots.push({
        time: timeString,
        available: !isBooked,
        bufferMinutes: selectedService.bufferMinutes
      });

      startMinutes += durationPlusBuffer;
    }

    return slots;
  }, [selectedService, selectedDoctorId, selectedDate, appointments]);

  // Handle AI Pre-Consultation Simulation
  const handleRunAiTriage = () => {
    setAiAnalyzing(true);
    setTimeout(() => {
      let recServiceId = 'srv-3';
      let recDocId = 'doc-3';
      let urgency = 'Routine';
      let summary = 'Standard dermatology check-up suggested for evaluation.';

      if (skinConcern === 'Acne & Scarring' || skinConcern === 'Wrinkles / Laxity') {
        recServiceId = 'srv-1'; // CO2 Laser
        recDocId = 'doc-1';
        urgency = 'Procedural Recommendation';
        summary = 'Textural changes detected. Recommending CO₂ Laser (60m duration) with 15m post-laser cooling buffer.';
      } else if (skinConcern === 'Hair Thinning') {
        recServiceId = 'srv-2'; // PRP
        recDocId = 'doc-2';
        summary = 'Regenerative PRP therapy recommended. Requires 45 min slot.';
      }

      setAiResult({
        recommendedServiceId: recServiceId,
        recommendedDoctorId: recDocId,
        urgency,
        summary,
        estimatedDuration: services.find(s => s.id === recServiceId)?.durationMinutes || 45,
        requiredBuffer: services.find(s => s.id === recServiceId)?.bufferMinutes || 10
      });
      setAiAnalyzing(false);
      setAiStep(3);
    }, 1500);
  };

  const applyAiRecommendation = () => {
    if (aiResult) {
      setSelectedServiceId(aiResult.recommendedServiceId);
      setSelectedDoctorId(aiResult.recommendedDoctorId);
      setActiveTab('book');
      showToast('AI Triage recommendation applied to booking form!');
    }
  };

  // Submit Final Booking
  const handleConfirmBooking = () => {
    if (!selectedSlot) {
      showToast('Please select an available time slot.', 'error');
      return;
    }
    if (!patientName || !patientPhone) {
      showToast('Please enter your name and phone number.', 'error');
      return;
    }

    if (selectedService?.requiresConsent && !consentAccepted) {
      setShowConsentModal(true);
      return;
    }

    const newApt = {
      id: `apt-${Date.now().toString().slice(-4)}`,
      patientName,
      patientPhone,
      patientEmail,
      doctorId: selectedDoctorId,
      serviceId: selectedServiceId,
      date: selectedDate,
      timeSlot: selectedSlot,
      status: 'Confirmed',
      queuePosition: appointments.filter(a => a.date === selectedDate && a.status !== 'Cancelled').length + 1,
      depositPaid: true,
      depositAmount: selectedService.depositRequired,
      intakeCompleted: true,
      consentSigned: consentAccepted,
      aiTriageNote: aiResult ? aiResult.summary : 'Direct patient online booking',
      createdDate: new Date().toISOString().split('T')[0]
    };

    setAppointments([...appointments, newApt]);
    showToast(`Appointment confirmed! $${selectedService.depositRequired} deposit recorded.`);
    setSelectedSlot('');
    setConsentAccepted(false);
    setShowConsentModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Patient Sub-navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'book', label: '1. Book Slot & Reserve', icon: Icons.Calendar },
          { id: 'aiTriage', label: '2. AI Symptom Triage', icon: Icons.Brain },
          { id: 'myQueue', label: '3. Live Queue Tracker', icon: Icons.Queue },
          { id: 'journey', label: '4. Treatment Journey', icon: Icons.ShieldCheck }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: DYNAMIC SLOT BOOKING */}
      {activeTab === 'book' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Form Setup */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
              <Icons.Sparkles />
              <span>Select Treatment & Specialist</span>
            </h2>

            {/* Service Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                1. Select Dermatology Service
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((srv) => (
                  <div
                    key={srv.id}
                    onClick={() => {
                      setSelectedServiceId(srv.id);
                      setSelectedSlot('');
                    }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition relative ${
                      selectedServiceId === srv.id
                        ? 'border-teal-500 bg-teal-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-slate-800">{srv.name}</span>
                      <span className="text-xs bg-teal-100 text-teal-800 font-semibold px-2 py-0.5 rounded-full">
                        {srv.durationMinutes} min
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{srv.description}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-2">
                      <span>Deposit: <strong>${srv.depositRequired}</strong></span>
                      <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-medium">
                        +{srv.bufferMinutes}m buffer
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Doctor Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                2. Select Dermatologist
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {doctors.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => {
                      setSelectedDoctorId(doc.id);
                      setSelectedSlot('');
                    }}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition flex flex-col items-center text-center ${
                      selectedDoctorId === doc.id
                        ? 'border-teal-500 bg-teal-50/50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="w-14 h-14 rounded-full object-cover mb-2 border border-slate-200"
                    />
                    <span className="font-bold text-sm text-slate-800 leading-tight">{doc.name}</span>
                    <span className="text-xs text-teal-600 font-medium">{doc.specialty}</span>
                    <span className="text-[11px] text-slate-400 mt-1">★ {doc.rating} ({doc.reviews} reviews)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                3. Choose Preferred Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedSlot('');
                }}
                className="w-full sm:w-64 p-3 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            {/* Dynamic Slot Grid */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                4. Available Real-Time Slots (Duration + Adaptive Buffer Included)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {availableSlots.map((slot, idx) => (
                  <button
                    key={idx}
                    disabled={!slot.available}
                    onClick={() => setSelectedSlot(slot.time)}
                    className={`p-3 rounded-xl text-center text-sm font-bold border transition flex flex-col items-center justify-center ${
                      !slot.available
                        ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed line-through'
                        : selectedSlot === slot.time
                        ? 'bg-teal-600 border-teal-600 text-white shadow-md'
                        : 'bg-white border-slate-300 text-slate-700 hover:border-teal-500 hover:bg-teal-50/30'
                    }`}
                  >
                    <span>{slot.time}</span>
                    <span className="text-[10px] opacity-75 font-normal">
                      {slot.available ? `+${slot.bufferMinutes}m buffer` : 'Reserved'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Checkout Summary & Patient Information */}
          <div className="bg-slate-900 text-white rounded-2xl shadow-xl p-6 flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-lg font-bold border-b border-slate-800 pb-3 flex items-center justify-between">
                <span>Reservation Summary</span>
                <span className="text-xs bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded">
                  Live Buffer Active
                </span>
              </h3>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Treatment:</span>
                  <span className="font-semibold text-teal-300">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Dermatologist:</span>
                  <span className="font-semibold">{selectedDoctor?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date & Slot:</span>
                  <span className="font-semibold">{selectedDate} @ {selectedSlot || 'Select time'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Slot Duration:</span>
                  <span>{selectedService?.durationMinutes} mins + {selectedService?.bufferMinutes}m buffer</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-3">
                  <span className="text-slate-300">Total Treatment Price:</span>
                  <span className="font-bold text-lg">${selectedService?.totalPrice}</span>
                </div>
                <div className="flex justify-between text-teal-400 font-semibold bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <span>Required Reservation Deposit:</span>
                  <span>${selectedService?.depositRequired}</span>
                </div>
              </div>

              {/* Patient Contact Form */}
              <div className="mt-6 space-y-3 border-t border-slate-800 pt-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Patient Contact Details</h4>
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
                <input
                  type="tel"
                  placeholder="Mobile Phone (for SMS Reminders) *"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              {selectedService?.requiresConsent && (
                <div className="flex items-center space-x-2 text-xs text-amber-300 bg-amber-900/30 p-2.5 rounded-lg border border-amber-800">
                  <Icons.AlertTriangle />
                  <span>Digital Pre-Procedure Consent required upon reservation.</span>
                </div>
              )}

              <button
                onClick={handleConfirmBooking}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-300 hover:to-cyan-400 text-slate-950 font-extrabold shadow-lg transition duration-200 transform hover:-translate-y-0.5"
              >
                Pay Deposit (${selectedService?.depositRequired}) & Reserve Slot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI PRE-CONSULTATION TRIAGE */}
      {activeTab === 'aiTriage' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 max-w-3xl mx-auto space-y-6">
          <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-teal-100 text-teal-800 p-3 rounded-2xl">
                <Icons.Brain />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">AI-Assisted Pre-Consultation Triage</h2>
                <p className="text-xs text-slate-500">Smart appointment routing & duration estimator (Decision Support Only)</p>
              </div>
            </div>
            <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full font-bold">
              Non-Diagnostic
            </span>
          </div>

          {/* AI Step Indicator */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-100 pb-3">
            <span className={aiStep >= 1 ? 'text-teal-600' : ''}>1. Symptom Questionnaire</span>
            <span>→</span>
            <span className={aiStep >= 2 ? 'text-teal-600' : ''}>2. Photo Intake (Optional)</span>
            <span>→</span>
            <span className={aiStep === 3 ? 'text-teal-600' : ''}>3. AI Recommendation</span>
          </div>

          {/* STEP 1 & 2 */}
          {aiStep < 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Primary Skin Concern</label>
                <select
                  value={skinConcern}
                  onChange={(e) => setSkinConcern(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500"
                >
                  <option>Acne & Scarring</option>
                  <option>Wrinkles / Laxity</option>
                  <option>Hair Thinning</option>
                  <option>Hyperpigmentation / Melasma</option>
                  <option>General Mole / Rash Check</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Symptom Duration (Weeks)</label>
                  <input
                    type="number"
                    value={durationWeeks}
                    onChange={(e) => setDurationWeeks(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Severity / Discomfort</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-sm"
                  >
                    <option>Mild</option>
                    <option>Moderate</option>
                    <option>Severe</option>
                  </select>
                </div>
              </div>

              {/* Simulated Image Upload */}
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-teal-500 transition">
                <p className="text-sm font-semibold text-slate-700">Upload Photo of Affected Skin Concern (Optional)</p>
                <p className="text-xs text-slate-400 mt-1">Allows visual AI pre-assessment for procedure complexity.</p>
                <button
                  type="button"
                  onClick={() => setImageUploaded(!imageUploaded)}
                  className={`mt-3 px-4 py-2 rounded-xl text-xs font-bold transition ${
                    imageUploaded ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-white'
                  }`}
                >
                  {imageUploaded ? '✓ Photo Simulated (AcneScar_01.jpg)' : 'Simulate Camera Upload'}
                </button>
              </div>

              <button
                onClick={handleRunAiTriage}
                disabled={aiAnalyzing}
                className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition flex items-center justify-center space-x-2"
              >
                {aiAnalyzing ? (
                  <span>Analyzing Symptoms with AI Engine...</span>
                ) : (
                  <>
                    <Icons.Brain />
                    <span>Run AI Triage & Get Recommended Slot</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* STEP 3: RESULT */}
          {aiStep === 3 && aiResult && (
            <div className="bg-slate-50 border border-teal-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center space-x-2 text-teal-800 font-bold text-lg">
                <Icons.Sparkles />
                <span>AI Recommendation Generated</span>
              </div>

              <p className="text-sm text-slate-700 bg-white p-4 rounded-xl border border-slate-200">
                {aiResult.summary}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block">Recommended Service</span>
                  <span className="font-bold text-slate-800">
                    {services.find(s => s.id === aiResult.recommendedServiceId)?.name}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block">Suggested Specialist</span>
                  <span className="font-bold text-slate-800">
                    {doctors.find(d => d.id === aiResult.recommendedDoctorId)?.name}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block">Slot Time + Buffer</span>
                  <span className="font-bold text-teal-700">
                    {aiResult.estimatedDuration}m + {aiResult.requiredBuffer}m buffer
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 bg-amber-50 border border-amber-200 p-3 rounded-xl">
                <strong>Important Disclaimer (BR-09):</strong> This AI output is for clinical slot routing and preliminary duration allocation only. It does NOT constitute an autonomous medical diagnosis.
              </div>

              <div className="flex gap-3">
                <button
                  onClick={applyAiRecommendation}
                  className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-sm transition"
                >
                  Apply Recommendation to Booking Form
                </button>
                <button
                  onClick={() => setAiStep(1)}
                  className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-sm"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: LIVE QUEUE TRACKER */}
      {activeTab === 'myQueue' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 max-w-3xl mx-auto space-y-6">
          <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Live Clinic Queue & Waiting Status</h2>
              <p className="text-xs text-slate-500">Real-time doctor schedule and position tracking</p>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold animate-pulse">
              ● Live Updates Enabled
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments
              .filter((a) => a.status === 'In-Queue' || a.status === 'Confirmed')
              .map((apt) => {
                const doc = doctors.find((d) => d.id === apt.doctorId);
                const srv = services.find((s) => s.id === apt.serviceId);
                const estWaitMinutes = (apt.queuePosition || 1) * 15;

                return (
                  <div key={apt.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs text-slate-400 font-mono">#{apt.id}</span>
                        <h4 className="font-bold text-slate-800 text-base">{apt.patientName}</h4>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        apt.status === 'In-Queue' ? 'bg-teal-100 text-teal-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {apt.status}
                      </span>
                    </div>

                    <div className="text-xs space-y-1 text-slate-600 border-t border-slate-200 pt-3">
                      <div>Doctor: <strong>{doc?.name}</strong></div>
                      <div>Procedure: <strong>{srv?.name}</strong> ({srv?.durationMinutes}m)</div>
                      <div>Scheduled Time: <strong>{apt.timeSlot} ({apt.date})</strong></div>
                    </div>

                    <div className="bg-teal-900 text-white p-3 rounded-xl flex items-center justify-between text-xs font-semibold">
                      <span>Queue Position: #{apt.queuePosition || '—'}</span>
                      <span>Est. Wait: ~{estWaitMinutes} mins</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 4: TREATMENT JOURNEY */}
      {activeTab === 'journey' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 max-w-4xl mx-auto space-y-6">
          <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-4">
            Treatment Journey & Post-Procedure Care
          </h2>

          <div className="space-y-4">
            {appointments.map((apt) => {
              const srv = services.find((s) => s.id === apt.serviceId);
              return (
                <div key={apt.id} className="border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-800">{srv?.name}</span>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{apt.date}</span>
                    </div>
                    <p className="text-xs text-slate-500">Patient: {apt.patientName} ({apt.patientPhone})</p>
                    <p className="text-xs text-teal-700 bg-teal-50 p-2 rounded-lg mt-2">
                      <strong>Care Instructions:</strong> {srv?.prepInstructions}
                    </p>
                  </div>

                  <div className="text-right flex flex-col items-end justify-center">
                    <span className="text-xs font-bold text-slate-500">Status</span>
                    <span className="text-sm font-semibold text-emerald-600">{apt.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DIGITAL CONSENT & INTAKE MODAL */}
      {showConsentModal && selectedService && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="border-b border-slate-200 pb-3 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">
                Digital Pre-Procedure Consent & Intake
              </h3>
              <button
                onClick={() => setShowConsentModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600 max-h-60 overflow-y-auto p-3 bg-slate-50 rounded-xl border border-slate-200">
              <p className="font-bold text-slate-800">Treatment: {selectedService.name}</p>
              <p>
                By signing below, you acknowledge risks associated with {selectedService.category} procedures, including mild erythema, localized edema, or temporary skin sensitivity.
              </p>

              <div className="space-y-2 border-t border-slate-200 pt-3">
                <span className="font-bold text-slate-800 block">Medical Pre-Intake Questions:</span>
                <label className="flex items-center justify-between">
                  <span>Currently taking Roaccutane / Isotretinoin?</span>
                  <select
                    value={medicalIntakeHistory.roaccutane}
                    onChange={(e) => setMedicalIntakeHistory({ ...medicalIntakeHistory, roaccutane: e.target.value })}
                    className="p-1 border rounded bg-white"
                  >
                    <option>No</option>
                    <option>Yes</option>
                  </select>
                </label>
                <label className="flex items-center justify-between">
                  <span>Pregnant or Nursing?</span>
                  <select
                    value={medicalIntakeHistory.pregnant}
                    onChange={(e) => setMedicalIntakeHistory({ ...medicalIntakeHistory, pregnant: e.target.value })}
                    className="p-1 border rounded bg-white"
                  >
                    <option>No</option>
                    <option>Yes</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="consentCheck"
                checked={consentAccepted}
                onChange={(e) => setConsentAccepted(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded border-slate-300"
              />
              <label htmlFor="consentCheck" className="text-xs text-slate-700 font-medium">
                I confirm medical intake accuracy and digitally sign consent.
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleConfirmBooking}
                disabled={!consentAccepted}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition ${
                  consentAccepted
                    ? 'bg-teal-600 text-white hover:bg-teal-700'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Sign Consent & Finalize Reservation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DoctorHubView({ doctors, setDoctors, services, appointments, setAppointments, showToast }) {
  const [selectedDocId, setSelectedDocId] = useState(doctors[0]?.id || '');
  const [activeDate, setActiveDate] = useState('2026-09-09');
  const [selectedAptDetails, setSelectedAptDetails] = useState(null);
  const [clinicalNoteInput, setClinicalNoteInput] = useState('');
  const [followUpWeeks, setFollowUpWeeks] = useState('4');

  const currentDoctor = doctors.find((d) => d.id === selectedDocId);

  // Filter appointments for selected doctor & date
  const doctorAppointments = appointments.filter(
    (a) => a.doctorId === selectedDocId && a.date === activeDate && a.status !== 'Cancelled'
  );

  const handleUpdateStatus = (aptId, newStatus) => {
    setAppointments(
      appointments.map((a) => (a.id === aptId ? { ...a, status: newStatus } : a))
    );
    showToast(`Appointment #${aptId} status updated to ${newStatus}`);
  };

  const handleSaveClinicalNotes = () => {
    if (!selectedAptDetails) return;
    setAppointments(
      appointments.map((a) =>
        a.id === selectedAptDetails.id
          ? {
              ...a,
              clinicalNotes: clinicalNoteInput,
              followUpRecommendedWeeks: followUpWeeks,
              status: 'Completed'
            }
          : a
      )
    );
    showToast('Clinical notes & follow-up recommendation saved!');
    setSelectedAptDetails(null);
  };

  return (
    <div className="space-y-6">
      {/* Doctor Header Selector */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <img
            src={currentDoctor?.avatar}
            alt={currentDoctor?.name}
            className="w-12 h-12 rounded-full object-cover border border-slate-200"
          />
          <div>
            <h2 className="font-bold text-slate-800">{currentDoctor?.name}</h2>
            <p className="text-xs text-teal-600 font-medium">{currentDoctor?.specialty} • Hours: {currentDoctor?.hours}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="p-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-slate-50"
          >
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <input
            type="date"
            value={activeDate}
            onChange={(e) => setActiveDate(e.target.value)}
            className="p-2.5 rounded-xl border border-slate-300 text-xs font-bold"
          />
        </div>
      </div>

      {/* Main Schedule Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Daily Time Slots */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
          <h3 className="font-bold text-slate-800 text-lg border-b border-slate-200 pb-3 flex justify-between">
            <span>Daily Consultations & Procedure Schedule</span>
            <span className="text-xs font-normal text-slate-500">
              {doctorAppointments.length} bookings on {activeDate}
            </span>
          </h3>

          {doctorAppointments.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">No patient reservations for this date.</p>
          ) : (
            <div className="space-y-3">
              {doctorAppointments.map((apt) => {
                const srv = services.find((s) => s.id === apt.serviceId);
                return (
                  <div
                    key={apt.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-md transition space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-mono font-extrabold text-teal-700 bg-teal-100 px-2.5 py-1 rounded-lg">
                          {apt.timeSlot}
                        </span>
                        <div>
                          <h4 className="font-bold text-slate-800">{apt.patientName}</h4>
                          <span className="text-xs text-slate-500">{srv?.name} ({srv?.durationMinutes} mins)</span>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        apt.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : apt.status === 'In-Queue'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {apt.status}
                      </span>
                    </div>

                    {/* AI & Consent Badges */}
                    <div className="flex flex-wrap gap-2 text-[11px] pt-2 border-t border-slate-200">
                      <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium">
                        AI Note: {apt.aiTriageNote}
                      </span>
                      {apt.consentSigned && (
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                          ✓ Consent Signed
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => {
                          setSelectedAptDetails(apt);
                          setClinicalNoteInput(apt.clinicalNotes || '');
                        }}
                        className="px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-700"
                      >
                        Open Clinical Chart
                      </button>
                      {apt.status !== 'Completed' && (
                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'Completed')}
                          className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700"
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col: Patient Clinical Chart Modal / Sidebar */}
        <div className="bg-slate-900 text-white rounded-2xl shadow-xl p-6 space-y-4">
          <h3 className="font-bold text-base border-b border-slate-800 pb-3">
            Clinical Intake & Follow-Up Manager
          </h3>

          {selectedAptDetails ? (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-800 p-3 rounded-xl space-y-1">
                <span className="text-slate-400 block">Patient Name</span>
                <span className="font-bold text-sm text-teal-300">{selectedAptDetails.patientName}</span>
                <span className="text-slate-400 block mt-2">Phone: {selectedAptDetails.patientPhone}</span>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Dermatologist Clinical Notes</label>
                <textarea
                  rows={4}
                  value={clinicalNoteInput}
                  onChange={(e) => setClinicalNoteInput(e.target.value)}
                  placeholder="Record treatment parameters, laser fluence, or prescription instructions..."
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Recommend Follow-Up Session</label>
                <select
                  value={followUpWeeks}
                  onChange={(e) => setFollowUpWeeks(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                >
                  <option value="2">2 Weeks (Post-peel check)</option>
                  <option value="4">4 Weeks (Laser / PRP Session 2)</option>
                  <option value="8">8 Weeks (Routine check)</option>
                </select>
              </div>

              <button
                onClick={handleSaveClinicalNotes}
                className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold rounded-xl transition"
              >
                Save Chart & Complete Consultation
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-10 text-center">
              Select a patient from the daily schedule to view intake details or write session notes.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ReceptionDeskView({ doctors, services, appointments, setAppointments, waitingList, setWaitingList, showToast }) {
  const [filterDate, setFilterDate] = useState('2026-09-09');

  const filteredAppointments = appointments.filter((a) => a.date === filterDate);

  const handleUpdateStatus = (id, status) => {
    setAppointments(
      appointments.map((a) => (a.id === id ? { ...a, status } : a))
    );
    showToast(`Appointment status changed to ${status}`);
  };

  // Smart Reallocation Workflow (BR-07, SRS FR-45)
  const handleReallocateCancelledSlot = (waitItem) => {
    const newApt = {
      id: `apt-${Date.now().toString().slice(-4)}`,
      patientName: waitItem.patientName,
      patientPhone: waitItem.phone,
      doctorId: waitItem.preferredDoctorId,
      serviceId: waitItem.serviceId,
      date: waitItem.preferredDate,
      timeSlot: '11:00', // auto-assigned slot
      status: 'Confirmed',
      queuePosition: 3,
      depositPaid: true,
      depositAmount: 50,
      intakeCompleted: true,
      consentSigned: false,
      aiTriageNote: 'Reallocated from clinic waiting list',
      createdDate: new Date().toISOString().split('T')[0]
    };

    setAppointments([...appointments, newApt]);
    setWaitingList(waitingList.filter((w) => w.id !== waitItem.id));
    showToast(`Waiting list patient ${waitItem.patientName} reallocated to vacant slot!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Reception & Desk Operations</h2>
          <p className="text-xs text-slate-500">Live check-ins, queue position, deposits & waiting list reallocation</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-500">Filter Date:</span>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="p-2 rounded-xl border border-slate-300 text-xs font-bold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Patient Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
          <h3 className="font-bold text-slate-800 text-base border-b border-slate-200 pb-3">
            Today's Scheduled Arrivals
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-[11px] uppercase tracking-wider">
                  <th className="py-2 px-3">Time</th>
                  <th className="py-2 px-3">Patient</th>
                  <th className="py-2 px-3">Doctor</th>
                  <th className="py-2 px-3">Deposit</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredAppointments.map((apt) => {
                  const doc = doctors.find((d) => d.id === apt.doctorId);
                  return (
                    <tr key={apt.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-3 font-mono font-bold text-teal-700">{apt.timeSlot}</td>
                      <td className="py-3 px-3">
                        <span className="font-bold block text-slate-800">{apt.patientName}</span>
                        <span className="text-[10px] text-slate-400">{apt.patientPhone}</span>
                      </td>
                      <td className="py-3 px-3">{doc?.name}</td>
                      <td className="py-3 px-3">
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                          ${apt.depositAmount} Paid
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-700">{apt.status}</span>
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={apt.status}
                          onChange={(e) => handleUpdateStatus(apt.id, e.target.value)}
                          className="p-1 rounded border border-slate-300 text-xs font-semibold bg-white"
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="In-Queue">In-Queue</option>
                          <option value="In-Consultation">In-Consultation</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Smart Waiting List Reallocation */}
        <div className="bg-slate-900 text-white rounded-2xl shadow-xl p-6 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
            <h3 className="font-bold text-base">Smart Waiting List</h3>
            <span className="text-xs bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded font-bold">
              {waitingList.length} Waiting
            </span>
          </div>

          <div className="space-y-3">
            {waitingList.map((item) => {
              const srv = services.find((s) => s.id === item.serviceId);
              return (
                <div key={item.id} className="bg-slate-800 p-3 rounded-xl text-xs space-y-2 border border-slate-700">
                  <div className="flex justify-between font-bold">
                    <span>{item.patientName}</span>
                    <span className="text-teal-400">{item.phone}</span>
                  </div>
                  <p className="text-slate-400">Request: {srv?.name} ({item.preferredDate})</p>
                  <p className="text-[11px] text-slate-500 italic">"{item.notes}"</p>
                  <button
                    onClick={() => handleReallocateCancelledSlot(item)}
                    className="w-full py-2 bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 font-extrabold rounded-lg hover:from-teal-300 hover:to-cyan-400 transition"
                  >
                    Reallocate To Vacant Slot
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminAnalyticsView({ doctors, setDoctors, services, setServices, appointments }) {
  // Analytical Metrics Calculation
  const totalRevenue = useMemo(() => {
    return appointments.reduce((acc, apt) => {
      const srv = services.find((s) => s.id === apt.serviceId);
      return acc + (srv ? srv.totalPrice : 0);
    }, 0);
  }, [appointments, services]);

  const totalDeposits = useMemo(() => {
    return appointments.reduce((acc, apt) => acc + (apt.depositAmount || 0), 0);
  }, [appointments]);

  return (
    <div className="space-y-6">
      {/* Metric Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Clinic Revenue', value: `$${totalRevenue}`, change: '+14% vs last month', color: 'teal' },
          { label: 'Deposits Collected', value: `$${totalDeposits}`, change: '100% reservation rate', color: 'emerald' },
          { label: 'Total Appointments', value: appointments.length, change: 'Active 12-week prototype', color: 'indigo' },
          { label: 'Avg Waiting Time', value: '14.2 mins', change: '-22% with smart buffers', color: 'cyan' }
        ].map((card, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.label}</span>
            <div className="text-2xl font-black text-slate-800">{card.value}</div>
            <span className="text-[11px] text-teal-600 font-semibold">{card.change}</span>
          </div>
        ))}
      </div>

      {/* Analytics Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Doctor Utilization Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-base border-b border-slate-200 pb-3">
            Specialist Schedule Utilization Rate
          </h3>

          <div className="space-y-4">
            {doctors.map((doc) => {
              const count = appointments.filter((a) => a.doctorId === doc.id).length;
              const percentage = Math.min(count * 25, 95); // calculated dummy utilization
              return (
                <div key={doc.id} className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>{doc.name} ({doc.specialty})</span>
                    <span>{percentage}% Booked</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Treatment Category Demand Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-base border-b border-slate-200 pb-3">
            Treatment Service Popularity
          </h3>

          <div className="space-y-3">
            {services.map((srv) => {
              const count = appointments.filter((a) => a.serviceId === srv.id).length;
              return (
                <div key={srv.id} className="flex justify-between items-center text-xs p-3 bg-slate-50 rounded-xl">
                  <div>
                    <span className="font-bold text-slate-800 block">{srv.name}</span>
                    <span className="text-slate-400 text-[10px]">{srv.category} • {srv.durationMinutes}m slot</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-teal-700 block">{count} Bookings</span>
                    <span className="text-[10px] text-slate-400">${srv.totalPrice}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}