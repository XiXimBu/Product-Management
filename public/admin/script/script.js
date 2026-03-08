const statusButtons = document.querySelectorAll("[button-filter-status]")
if (statusButtons.length > 0) {
    statusButtons.forEach((button) => {
        button.addEventListener("click", () => {
            let url = new URL(window.location.href)

            const status = button.getAttribute("data-status")

            if (status) {
                url.searchParams.set("status", status)
            }

            else { url.searchParams.delete("status") }

            window.location.href = url.href; // Chuyển hướng
        })
    })
}


//Form Search
const formSearch = document.querySelector("#form-search")
if (formSearch) {
    let url = new URL(window.location.href)
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault()
        const keyword = e.target.elements.keyword.value
        if (keyword) {
            url.searchParams.set("keyword", keyword)
        }
        else {
            url.searchParams.delete("keyword")
        }
        window.location.href = url.href
    })
}

// pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]");
if (buttonsPagination.length > 0) {
    buttonsPagination.forEach((button) => {
        button.addEventListener("click", () => {
            let url = new URL(window.location.href)
            const page = button.getAttribute("button-pagination");
            console.log(page)
            if (page) {
                url.searchParams.set("page", page)
                // sessionStorage.setItem("debug_page", page)
            }
            window.location.href = url.href
        })
    })
}

//checkbox multi
const checkbocMulti = document.querySelector("[checkbox-multi]")
if (checkbocMulti) {
    const inputCheckAll = checkbocMulti.querySelector("[data-checkall]")
    const inputCheck = checkbocMulti.querySelectorAll("[data-checkbox]")


    inputCheckAll.addEventListener("click", () => {
        inputCheck.forEach((input) => {
            input.checked = inputCheckAll.checked
        })
    })


    inputCheck.forEach((input) => {
        input.addEventListener("click", () => {
            const checkedCount = checkbocMulti.querySelectorAll("[data-checkbox]:checked").length
            const totalCount = inputCheck.length
            
            inputCheckAll.checked = (checkedCount === totalCount)
        })
    })
}

// Form change multi
const formChangeMulti = document.querySelector("[form-change-multi]")
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault()
        
        const inputChecked = checkbocMulti.querySelectorAll("[data-checkbox]:checked")
        const type = formChangeMulti.querySelector("select[name='type']").value
        
        if (inputChecked.length > 0) {
            if (type === "deleted-all") {
                const isConfirm = confirm("Bạn có chắc muốn xóa tất cả sản phẩm đã chọn?")
                if (!isConfirm) return
            }

            let ids = []
            inputChecked.forEach((input) => {
                ids.push(input.value)
            })
            
            // Gán ids vào input hidden
            const inputIds = formChangeMulti.querySelector("input[name='ids']")
            inputIds.value = ids.join(", ")
            
            // Submit form
            formChangeMulti.submit()
        } else {
            alert("Vui lòng chọn ít nhất một sản phẩm!")
        }
    })
}
// Delete Product
const buttonsDelete = document.querySelectorAll("[button-delete]")
if (buttonsDelete.length > 0) {
    const formDelete = document.querySelector("#form-delete")
    const path = formDelete.getAttribute("data-path")

    // helper to ensure _method hidden input
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

    buttonsDelete.forEach((button) => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc muốn xóa sản phẩm này?")
            if (!isConfirm) return

            const id = button.getAttribute("data-id")
            const action = `${path}/${id}`
            formDelete.setAttribute("action", action)
            ensureMethodInput(formDelete, 'DELETE')
            formDelete.submit()
        })
    })
}

// Auto-dismiss flash messages sau 5 giây
document.addEventListener('DOMContentLoaded', () => {
    const alerts = document.querySelectorAll('.alert');
    if (alerts.length > 0) {
        alerts.forEach((alert) => {
            setTimeout(() => {
                $(alert).alert('close');
            }, 5000); // 5 giây
        });
    }
});

// Prevent double submit form
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');
    forms.forEach((form) => {
        form.addEventListener('submit', function(e) {
            const submitButton = this.querySelector('button[type="submit"]');
            if (submitButton) {
                // Disable button để tránh click nhiều lần
                if (submitButton.disabled) {
                    e.preventDefault();
                    return false;
                }
                submitButton.disabled = true;
                submitButton.innerHTML = '<span class="spinner-border spinner-border-sm mr-1"></span> Đang xử lý...';
            }
        });
    });
});
// Upload image preview
const uploadImage = document.querySelector("[upload-image]")
if (uploadImage) {
    const inputFile = uploadImage.querySelector("input[type='file']")
    const imgPreview = uploadImage.querySelector("[upload-preview]")
    const deleteButton = uploadImage.querySelector("[button-delete-image]")

    inputFile.addEventListener("change", (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                imgPreview.src = e.target.result
                imgPreview.style.display = "block"
                deleteButton.style.display = "block"
            }
            reader.readAsDataURL(file)
        }
    })

    deleteButton.addEventListener("click", (e) => {
        e.preventDefault()
        imgPreview.src = ""
        imgPreview.style.display = "none"
        inputFile.value = ""
        deleteButton.style.display = "none"
    })
}