// Handle change status button click
document.addEventListener('DOMContentLoaded', function() {
  // Change status
  const buttonChangeStatus = document.querySelectorAll('[button-change-status]')

  if (buttonChangeStatus.length > 0) {
    buttonChangeStatus.forEach(button => {
      button.addEventListener('click', function() {
        const id = this.getAttribute('data-id')
        const form = document.getElementById('form-change-status')
        const path = form.getAttribute('data-path')

        form.action = `${path}/${id}?_method=PATCH`
        form.method = 'POST'
        form.submit()
      })
    })
  }

  // Delete
  const buttonDelete = document.querySelectorAll('[button-delete]')

  if (buttonDelete.length > 0) {
    buttonDelete.forEach(button => {
      button.addEventListener('click', function() {
        if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
          const id = this.getAttribute('data-id')
          const form = document.getElementById('form-delete')
          const path = form.getAttribute('data-path')

          form.action = `${path}/${id}?_method=DELETE`
          form.method = 'POST'
          form.submit()
        }
      })
    })
  }
})
