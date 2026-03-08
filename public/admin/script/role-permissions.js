/**
 * Role Permissions Manager
 * Handles category filtering, checkbox selection, and dynamic counting
 */

document.addEventListener('DOMContentLoaded', function() {
  initializePermissionSelectors()
  initializeCategorySelectAll()
  initializePermissionCheckboxes()
})

/**
 * Initialize all permission-related functionality
 */
function initializePermissionSelectors() {
  const selectAllBtns = document.querySelectorAll('.select-all-category')
  selectAllBtns.forEach(btn => {
    // Set initial indeterminate state
    const category = btn.getAttribute('data-category')
    updateSelectAllButton(category)
  })
}

/**
 * Setup select-all buttons for each category
 */
function initializeCategorySelectAll() {
  document.querySelectorAll('.select-all-category').forEach(selectAllBtn => {
    selectAllBtn.addEventListener('change', function() {
      const category = this.getAttribute('data-category')
      const className = `category-${safeCssClass(category)}`
      const checkboxes = document.querySelectorAll(
        `input[type="checkbox"].permission-checkbox.${className}`
      )
      
      checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllBtn.checked
        togglePermissionBadge(checkbox, selectAllBtn.checked)
      })
      
      updateCategoryBadge(category)
    })
  })
}

/**
 * Setup individual permission checkboxes
 */
function initializePermissionCheckboxes() {
  document.querySelectorAll('.permission-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const category = this.getAttribute('data-category')
      togglePermissionBadge(this, this.checked)
      updateCategoryBadge(category)
      updateSelectAllButton(category)
    })
  })
}

/**
 * Convert string to safe CSS class name
 */
function safeCssClass(str) {
  return str.replace(/\s+/g, '-').toLowerCase()
}

/**
 * Toggle the checkmark badge next to a permission
 */
function togglePermissionBadge(checkbox, show) {
  const label = checkbox.parentElement.querySelector('.form-check-label')
  if (!label) return
  
  const badge = label.querySelector('.badge.badge-success')
  if (badge) {
    badge.style.display = show ? 'inline' : 'none'
  }
}

/**
 * Update the count badge for a category (e.g., "2/4")
 */
function updateCategoryBadge(category) {
  const className = `category-${safeCssClass(category)}`
  const checkboxes = document.querySelectorAll(
    `input[type="checkbox"].permission-checkbox.${className}`
  )
  
  const selectedCount = Array.from(checkboxes).filter(cb => cb.checked).length
  const totalCount = checkboxes.length
  
  const badgeClass = `badge-${safeCssClass(category)}`
  const badges = document.querySelectorAll(`.${badgeClass}`)
  badges.forEach(badge => {
    badge.textContent = `${selectedCount}/${totalCount}`
  })
}

/**
 * Update select-all button state (checked/indeterminate/unchecked)
 */
function updateSelectAllButton(category) {
  const className = `category-${safeCssClass(category)}`
  const checkboxes = document.querySelectorAll(
    `input[type="checkbox"].permission-checkbox.${className}`
  )
  const selectAllBtn = document.querySelector(
    `input[data-category="${category}"].select-all-category`
  )
  
  if (!selectAllBtn) return
  
  const allChecked = Array.from(checkboxes).every(cb => cb.checked)
  const someChecked = Array.from(checkboxes).some(cb => cb.checked)
  
  selectAllBtn.checked = allChecked
  selectAllBtn.indeterminate = someChecked && !allChecked
}

/**
 * Get all selected permissions
 */
function getSelectedPermissions() {
  return Array.from(
    document.querySelectorAll('input[name="permissions"]:checked')
  ).map(checkbox => checkbox.value)
}

/**
 * Get selected permissions by category
 */
function getSelectedPermissionsByCategory(category) {
  const className = `category-${safeCssClass(category)}`
  return Array.from(
    document.querySelectorAll(
      `input[type="checkbox"].permission-checkbox.${className}:checked`
    )
  ).map(checkbox => checkbox.value)
}
