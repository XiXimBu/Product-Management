//Restore Product
const buttonsRestore = document.querySelectorAll("[button-restore]")
if (buttonsRestore.length > 0) {
    const formRestore = document.querySelector("#form-restore")
    const path = formRestore.getAttribute("data-path")

    // helper to ensure hidden _method input exists
    function ensureMethodInput(form, method) {
        let input = form.querySelector("input[name='_method']")
        if (!input) {
            input = document.createElement('input')
            input.type = 'hidden'
            input.name = '_method'
            form.appendChild(input)
        }
        input.value = method
    }

    buttonsRestore.forEach((button) => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc muốn khôi phục sản phẩm này?")
            if (!isConfirm) return

            const id = button.getAttribute("data-id")
            const action = `${path}/${id}`
            formRestore.setAttribute("action", action)
            ensureMethodInput(formRestore, 'PATCH')
            formRestore.submit()
        })
    })
}

//Delete Permanent
const buttonsDeletePermanent = document.querySelectorAll("[button-delete-permanent]")
if (buttonsDeletePermanent.length > 0) {
    const formDeletePermanent = document.querySelector("#form-delete-permanent")
    const path = formDeletePermanent.getAttribute("data-path")

    buttonsDeletePermanent.forEach((button) => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc muốn xóa vĩnh viễn sản phẩm này? Hành động này không thể hoàn tác!")
            if (!isConfirm) return

            const id = button.getAttribute("data-id")
            const action = `${path}/${id}`
            formDeletePermanent.setAttribute("action", action)
            ensureMethodInput(formDeletePermanent, 'DELETE')
            formDeletePermanent.submit()
        })
    })
}
