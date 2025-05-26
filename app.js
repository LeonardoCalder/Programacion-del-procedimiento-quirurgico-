document.getElementById('appointmentForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const patientName = document.getElementById('patientName').value.trim();
  const appointmentDate = document.getElementById('appointmentDate').value;
  const appointmentTime = document.getElementById('appointmentTime').value;
  const reason = document.getElementById('reason').value.trim();

  if (!appointmentDate || !appointmentTime) {
    alert('Por favor, ingresa fecha y hora válidas.');
    return;
  }

  const startDateTime = new Date(appointmentDate + 'T' + appointmentTime).toISOString();

  const appointmentData = {
    resourceType: "Appointment",
    status: "booked",
    start: startDateTime,
    participant: [
      {
        actor: { display: patientName },
        status: "accepted"
      }
    ],
    description: reason
  };

  console.log("Datos a enviar:", appointmentData);

  fetch('https://hl7-fhir-ehr-leonardo.onrender.com/appointment/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/fhir+json' },
    body: JSON.stringify(appointmentData)
  })
  .then(response => {
    if (!response.ok) {
      return response.text().then(text => { throw new Error(text || response.statusText); });
    }
    return response.json();
  })
  .then(data => {
    console.log('Cita agendada exitosamente:', data);
    document.getElementById('result').textContent = '¡Cirugía programada exitosamente! ID: ' + (data.id || data._id || '');
    document.getElementById('result').style.color = '#004d40';
    document.getElementById('appointmentForm').reset();
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('result').textContent = 'Error al programar la cirugía: ' + error.message;
    document.getElementById('result').style.color = '#b00020';
  });
});
