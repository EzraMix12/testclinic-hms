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
        { id: 10, name: 'Isabella Fernandez', age: 31, gender: 'Female', contact: '09445566778', history: 'None' },
        { id: 11, name: 'Ramon Bautista', age: 58, gender: 'Male', contact: '09556677889', history: 'Heart Disease, Hypertension' },
        { id: 12, name: 'Carla Mendoza', age: 26, gender: 'Female', contact: '09667788990', history: 'None' },
        { id: 13, name: 'Ferdinand Aquino', age: 43, gender: 'Male', contact: '09778899001', history: 'Gout' },
        { id: 14, name: 'Jasmine Villanueva', age: 37, gender: 'Female', contact: '09889900112', history: 'Migraine, Anxiety' },
        { id: 15, name: 'Antonio Lopez', age: 61, gender: 'Male', contact: '09990011223', history: 'Diabetes Type 2, Hypertension' },
        { id: 16, name: 'Beatriz Santiago', age: 22, gender: 'Female', contact: '09101122334', history: 'None' },
        { id: 17, name: 'Ricardo Morales', age: 48, gender: 'Male', contact: '09212233445', history: 'Kidney Stones' },
        { id: 18, name: 'Teresa Navarro', age: 54, gender: 'Female', contact: '09323344556', history: 'Osteoporosis, Thyroid' },
        { id: 19, name: 'Vicente Salazar', age: 39, gender: 'Male', contact: '09434455667', history: 'None' },
        { id: 20, name: 'Lucia Romero', age: 33, gender: 'Female', contact: '09545566778', history: 'PCOS, Anemia' },
        { id: 21, name: 'Gabriel Herrera', age: 27, gender: 'Male', contact: '09656677889', history: 'Asthma' },
        { id: 22, name: 'Patricia Jimenez', age: 46, gender: 'Female', contact: '09767788990', history: 'Hypertension' },
        { id: 23, name: 'Emilio Pascual', age: 50, gender: 'Male', contact: '09878899001', history: 'Ulcer, GERD' },
        { id: 24, name: 'Rosa Mercado', age: 44, gender: 'Female', contact: '09989900112', history: 'Allergic Rhinitis' },
        { id: 25, name: 'Francisco Gutierrez', age: 36, gender: 'Male', contact: '09190011223', history: 'None' }
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
        { qNo: 110, patientId: 10, name: 'Isabella Fernandez', doctor: 'Dr. Michael Chen', purpose: 'General Checkup', status: 'Waiting' },
        { qNo: 111, patientId: 11, name: 'Ramon Bautista', doctor: 'Dr. Sarah Jenkins', purpose: 'Chest Pain', status: 'Completed' },
        { qNo: 112, patientId: 12, name: 'Carla Mendoza', doctor: 'Dr. Michael Chen', purpose: 'Prenatal Checkup', status: 'Consultation' },
        { qNo: 113, patientId: 13, name: 'Ferdinand Aquino', doctor: 'Dr. Sarah Jenkins', purpose: 'Joint Pain - Gout', status: 'Waiting' },
        { qNo: 114, patientId: 14, name: 'Jasmine Villanueva', doctor: 'Dr. Michael Chen', purpose: 'Headache', status: 'Waiting' },
        { qNo: 115, patientId: 15, name: 'Antonio Lopez', doctor: 'Dr. Sarah Jenkins', purpose: 'Blood Sugar Check', status: 'Completed' }
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