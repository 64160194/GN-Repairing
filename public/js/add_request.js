document.addEventListener('DOMContentLoaded', function() {
    const otherRadio = document.getElementById('other');
    const otherInput = document.getElementById('otherRepairTypeInput');

    function toggleOtherInput() {
        if (otherRadio.checked) {
            otherInput.style.display = 'block';
        } else {
            otherInput.style.display = 'none';
        }
    }

    // เพิ่ม event listener สำหรับทุก radio button
    const radioButtons = document.querySelectorAll('input[name="repairType"]');
    radioButtons.forEach(function(radio) {
        radio.addEventListener('change', toggleOtherInput);
    });

    // ตรวจสอบสถานะเริ่มต้น
    toggleOtherInput();
});