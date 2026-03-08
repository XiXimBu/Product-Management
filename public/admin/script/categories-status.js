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

        form.action = `${path}/${id}`
        form.method = 'POST'
        // ensure hidden _method input exists
        let input = form.querySelector("input[name='_method']")
        if (!input) {
          input = document.createElement('input')
          input.type = 'hidden'
          input.name = '_method'
          form.appendChild(input)
        }
        input.value = 'PATCH'
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

          form.action = `${path}/${id}`
          form.method = 'POST'
          let input = form.querySelector("input[name='_method']")
          if (!input) {
            input = document.createElement('input')
            input.type = 'hidden'
            input.name = '_method'
            form.appendChild(input)
          }
          input.value = 'DELETE'
          form.submit()
        }
      })
    })
  }
})
