// Default initial mock data if empty
if (!localStorage.getItem('pulse_patients')) {
    localStorage.setItem('pulse_patients', JSON.stringify([
        { id: 1, name: 'Juan Dela Cruz', age: 32, gender: 'Male', contact: '09171234567', history: 'None' },
        { id: 2, name: 'Maria Santos', age: 28, gender: 'Female', contact: '09189876543', history: 'Penicillin Allergy' },
        { id: 3, name: 'Pedro Reyes', age: 45, gender: 'Male', contact: '09123456789', history: 'Hypertension' },
        { id: 4, name: 'Ana Lim', age: 35, gender: 'Female', contact: '09987654321', history: 'Diabetes Type 2' },
        { id: 5, name: 'Carlos Garcia', age: 52, gender: 'Male', contact: '09156789012', history: 'None' },
        { id: 6, name: 'Elena Cruz', age: 29, gender: 'Female', contact: '09198765432', history: 'Asthma' },
        { id: 7, name: 'Roberto Tan', age: 41, gender: 'Male', contact: '09112233445', history: 'None' },
        { id: 8, name: 'Sophia Ramos', age: 24, gender: 'Female', contact: '09223344556', history: 'Shellfish Allergy' },
        { id: 9, name: 'Miguel Torres', age: 38, gender: 'Male', contact: '09334455667', history: 'Hypertension, Diabetes' },
        { id: 10, name: 'Isabella Fernandez', age: 31, gender: 'Female', contact: '09445566778', history: 'None' }
    ]));
}

if (!localStorage.getItem('pulse_queue')) {
    localStorage.setItem('pulse_queue', JSON.stringify([
        { qNo: 101, patientId: 1, name: 'Juan Dela Cruz', doctor: 'Dr. Sarah Jenkins', purpose: 'General Checkup', status: 'Waiting' },
        { qNo: 102, patientId: 2, name: 'Maria Santos', doctor: 'Dr. Sarah Jenkins', purpose: 'Fever', status: 'Consultation' },
        { qNo: 103, patientId: 3, name: 'Pedro Reyes', doctor: 'Dr. Sarah Jenkins', purpose: 'Follow-up - Hypertension', status: 'Waiting' },
        { qNo: 104, patientId: 4, name: 'Ana Lim', doctor: 'Dr. Michael Chen', purpose: 'Diabetes Management', status: 'Waiting' },
        { qNo: 105, patientId: 5, name: 'Carlos Garcia', doctor: 'Dr. Sarah Jenkins', purpose: 'Cough and Cold', status: 'Consultation' },
        { qNo: 106, patientId: 6, name: 'Elena Cruz', doctor: 'Dr. Michael Chen', purpose: 'Asthma Check', status: 'Waiting' },
        { qNo: 107, patientId: 7, name: 'Roberto Tan', doctor: 'Dr. Sarah Jenkins', purpose: 'Physical Exam', status: 'Completed' },
        { qNo: 108, patientId: 8, name: 'Sophia Ramos', doctor: 'Dr. Michael Chen', purpose: 'Skin Rash', status: 'Waiting' },
        { qNo: 109, patientId: 9, name: 'Miguel Torres', doctor: 'Dr. Sarah Jenkins', purpose: 'Medication Refill', status: 'Consultation' },
        { qNo: 110, patientId: 10, name: 'Isabella Fernandez', doctor: 'Dr. Michael Chen', purpose: 'General Checkup', status: 'Waiting' }
    ]));
}

function getPatients() {
    return JSON.parse(localStorage.getItem('pulse_patients')) || [];
}

function savePatients(patients) {
    localStorage.setItem('pulse_patients', JSON.stringify(patients));
}

function getQueue() {
    return JSON.parse(localStorage.getItem('pulse_queue')) || [];
}

function saveQueue(queue) {
    localStorage.setItem('pulse_queue', JSON.stringify(queue));
}