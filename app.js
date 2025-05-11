const procedimientoSelect = document.getElementById('procedimiento');

// Cargar procedimientos disponibles desde ServiceRequest (FHIR)
fetch('https://hl7-fhir-ehr-leonardo.onrender.com/fhir/ServiceRequest')
  .then(res => res.json())
  .then(data => {
    const procedimientos = new Set();

    if (data.entry) {
      data.entry.forEach(item => {
        const sr = item.resource;
        if (sr.status === 'active' && sr.code && sr.code.text) {
          procedimientos.add(sr.code.text);
        }
      });
    }

    // Limpiar y llenar el select con los procedimientos únicos
    procedimientoSelect.innerHTML = '<option value="">--Seleccione--</option>';
    procedimientos.forEach(proc => {
      const option = document.createElement('option');
      option.value = proc;
      option.textContent = proc;
      procedimientoSelect.appendChild(option);
    });

    if (procedimientos.size === 0) {
      const option = document.createElement('option');
      option.textContent = 'No hay procedimientos activos disponibles';
      option.disabled = true;
      procedimientoSelect.appendChild(option);
    }
  })
  .catch(error => {
    console.error('Error cargando procedimientos:', error);
    procedimientoSelect.innerHTML = '<option>Error al cargar procedimientos</option>';
  });


// Enviar cita programada (Appointment)
document.getElementById('appointmentForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const pacienteId = document.getElementById('paciente').value;
  const procedimiento = document.getElementById('procedimiento').value;
  const fecha = document.getElementById('fecha').value;
  const hora = document.getElementById('hora').value;
  const locationId = document.getElementById('location').value;

  const startDateTime = `${fecha}T${hora}:00Z`;

  const appointment = {
    resourceType: "Appointment",
    status: "booked",
    description: procedimiento,
    start: startDateTime,
    participant: [
      {
        actor: {
          reference: `Patient/${pacienteId}`
        },
        status: "accepted"
      },
      {
        actor: {
          reference: `Location/${locationId}`
        },
        status: "accepted"
      }
    ]
  };

  console.log('Enviando FHIR Appointment:', appointment);

  fetch('https://hl7-fhir-ehr-leonardo.onrender.com/fhir/Appointment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appointment)
  })
  .then(async response => {
    if (!response.ok) {
      throw new Error('Error en la programación: ' + response.statusText);
    }

    const ct = response.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      const data = await response.json();
      console.log('Appointment creado:', data);
      alert('Cirugía programada exitosamente! ID: ' + data.id);
    } else {
      alert('Cita programada, pero sin respuesta en JSON.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Hubo un error al programar la cirugía: ' + error.message);
  });
});
