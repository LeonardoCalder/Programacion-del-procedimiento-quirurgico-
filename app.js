document.getElementById('appointmentForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Obtener los valores del formulario
  const patientId = document.getElementById('patientId').value;
  const patientName = document.getElementById('patientName').value;
  const locationId = document.getElementById('locationId').value;
  const appointmentDate = document.getElementById('appointmentDate').value;
  const appointmentTime = document.getElementById('appointmentTime').value;
  const reason = document.getElementById('reason').value;

  // Construir fecha completa en formato ISO
  const startDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
  const isoDateTime = startDateTime.toISOString();

  // Construir el recurso FHIR Appointment
  const appointmentData = {
    resourceType: "Appointment",
    status: "booked",
    description: reason,
    start: isoDateTime,
    participant: [
      {
        actor: {
          reference: `Patient/${patientId}`,
          display: patientName
        },
        status: "accepted"
      },
      {
        actor: {
          reference: `Location/${locationId}`,
          display: `Quirófano ${locationId}`
        },
        status: "accepted"
      }
    ]
  };

  console.log("Recurso FHIR a enviar:", appointmentData);

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
    document.getElementById('result').innerHTML = `
      <div style="background-color: #e6ffe6; border-left: 6px solid #4CAF50; padding: 16px; margin-top: 20px; border-radius: 8px;">
        <h3 style="color: #2d662d;">¡Cita agendada exitosamente!</h3>
        <p><strong>ID:</strong> ${data._id}</p>
        <p><strong>Paciente:</strong> ${patientName}</p>
        <p><strong>Fecha y hora:</strong> ${isoDateTime}</p>
        <p><strong>Ubicación:</strong> Quirófano ${locationId}</p>
      </div>
    `;
    document.getElementById('appointmentForm').reset();
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('result').innerHTML = `
      <div style="background-color: #ffe6e6; border-left: 6px solid #f44336; padding: 16px; margin-top: 20px; border-radius: 8px;">
        <h3 style="color: #a94442;">Error al agendar la cita</h3>
        <p>${error.message}</p>
      </div>
    `;
  });
});
