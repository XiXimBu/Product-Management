//Product Status
const productStatus = document.querySelectorAll("[button-change-status]")
if (productStatus.length > 0) {
    const formChangStatus = document.querySelector("#form-change-status")
    const path = formChangStatus.getAttribute("data-path")

    productStatus.forEach(button => {
        button.addEventListener("click", () => {
         
            const statusCurrent = button.getAttribute("data-status")
            const id = button.getAttribute("data-id")
            
            let statusChange = statusCurrent == "active" ? "inactive" : "active"

            const action = path + `/${statusChange}/${id}?_method=PATCH`
            
            formChangStatus.setAttribute("action", action)

            formChangStatus.submit()
        })
    })
}