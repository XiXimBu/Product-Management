//Restore Product
const buttonsRestore = document.querySelectorAll("[button-restore]")
if (buttonsRestore.length > 0) {
    const formRestore = document.querySelector("#form-restore")
    const path = formRestore.getAttribute("data-path")

    buttonsRestore.forEach((button) => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc muốn khôi phục sản phẩm này?")
            if (!isConfirm) return

            const id = button.getAttribute("data-id")
            const action = `${path}/${id}?_method=PATCH`
            formRestore.setAttribute("action", action)
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
            const action = `${path}/${id}?_method=DELETE`
            formDeletePermanent.setAttribute("action", action)
            formDeletePermanent.submit()
        })
    })
}
