document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const finishTimeHours = document.getElementById('finish_time_hours');
    const finishTimeMinutes = document.getElementById('finish_time_minutes');
    const finishTimeHidden = document.getElementById('finish_time');

    function updateFinishTime() {
        const hours = parseInt(finishTimeHours.value) || 0;
        const minutes = parseInt(finishTimeMinutes.value) || 0;
        const totalMinutes = hours * 60 + minutes;
        finishTimeHidden.value = totalMinutes.toString();
    }

    finishTimeHours.addEventListener('change', updateFinishTime);
    finishTimeMinutes.addEventListener('change', updateFinishTime);

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        updateFinishTime();
        this.submit();
    });
});