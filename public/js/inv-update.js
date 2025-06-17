const form = document.querySelector("#editVehicleForm")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("#updateVehicle")
      updateBtn.removeAttribute("disabled")
})