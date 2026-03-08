document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('avatar')
  const preview = document.getElementById('avatarPreview')
  const removeBtn = document.getElementById('avatarRemove')
  if (!input || !preview) return

  input.addEventListener('change', () => {
    const file = input.files[0]
    if (!file) {
      preview.src = ''
      preview.style.display = 'none'
      if (removeBtn) removeBtn.style.display = 'none'
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      preview.src = e.target.result
      preview.style.display = 'inline-block'
      if (removeBtn) removeBtn.style.display = 'inline-block'
    }
    reader.readAsDataURL(file)
  })

  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      // Clear file input
      input.value = ''
      // Hide preview and button
      preview.src = ''
      preview.style.display = 'none'
      removeBtn.style.display = 'none'
    })
  }
})
