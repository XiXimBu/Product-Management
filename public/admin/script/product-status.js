//Product Status
const productStatus = document.querySelectorAll("[button-change-status]")
if (productStatus.length > 0) {
    const formChangStatus = document.querySelector("#form-change-status")
    const path = formChangStatus.getAttribute("data-path")

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

    productStatus.forEach(button => {
        button.addEventListener("click", () => {

            const statusCurrent = button.getAttribute("data-status")
            const id = button.getAttribute("data-id")
            
            let statusChange = statusCurrent == "active" ? "inactive" : "active"

            const action = path + `/${statusChange}/${id}`
            
            formChangStatus.setAttribute("action", action)
            ensureMethodInput(formChangStatus, 'PATCH')

            formChangStatus.submit()
        })
    })
}