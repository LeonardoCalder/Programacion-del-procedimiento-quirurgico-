document.getElementById('appointmentForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Obtener los valores del formulario
  const patientName = document.getElementById('patientName').value;
  const appointmentDate = document.getElementById('appointmentDate').value;
  const appointmentTime = document.getElementById('appointmentTime').value;
  const reason = document.getElementById('reason').value;

  // Construir el objeto con los datos de la cita
  const appointmentData = {
    patientName,
    appointmentDate,
    appointmentTime,
    reason
  };

  console.log("Datos a enviar:", appointmentData);

  // Enviar la solicitud al backend
  fetch('https://hl7-fhir-ehr-solangie-9665.onrender.com/appointment/', {
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
    document.getElementById('result').textContent = '¡Cita agendada exitosamente! ID: ' + data._id;
    document.getElementById('result').style.color = 'green';
    document.getElementById('appointmentForm').reset();
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('result').textContent = 'Error al agendar la cita: ' + error.message;
    document.getElementById('result').style.color = 'red';
  });
});
