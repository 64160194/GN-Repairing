document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const timeTakenHours = document.getElementById('time_taken_hours');
    const timeTakenMinutes = document.getElementById('time_taken_minutes');
    const timeTakenHidden = document.getElementById('time_taken');

    function updateTimeTaken() {
        const hours = parseInt(timeTakenHours.value) || 0;
        const minutes = parseInt(timeTakenMinutes.value) || 0;
        const totalMinutes = hours * 60 + minutes;
        timeTakenHidden.value = totalMinutes.toString();
    }

    timeTakenHours.addEventListener('change', updateTimeTaken);
    timeTakenMinutes.addEventListener('change', updateTimeTaken);

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        updateTimeTaken();
        this.submit();
    });
});