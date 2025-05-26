document.getElementById('appointmentForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Obtener los valores del formulario
  const patientId = document.getElementById('patientId').value.trim();
  const patientName = document.getElementById('patientName').value.trim();
  const appointmentDate = document.getElementById('appointmentDate').value;
  const appointmentTime = document.getElementById('appointmentTime').value;
  const reason = document.getElementById('reason').value.trim();

  // Construir objeto Appointment según FHIR para programación quirúrgica
  const appointmentData = {
    resourceType: "Appointment",
    status: "booked", // estado programada
    description: reason,
    start: appointmentDate + "T" + appointmentTime + ":00",
    participant: [
      {
        actor: {
          reference: `Patient/${patientId}`,
          display: patientName
        },
        status: "accepted"
      }
    ]
  };

  console.log("Datos a enviar:", appointmentData);

  // Enviar la solicitud al backend
  fetch('https://hl7-fhir-ehr-leonardo.onrender.com/appointment/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appointmentData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error en la solicitud: ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    console.log('Cita agendada exitosamente:', data);
    document.getElementById('result').textContent = '¡Cirugía programada exitosamente! ID: ' + data._id;
    document.getElementById('result').style.color = '#00796b';
    document.getElementById('appointmentForm').reset();
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('result').textContent = 'Error al programar la cirugía: ' + error.message;
    document.getElementById('result').style.color = '#d32f2f';
  });
});
