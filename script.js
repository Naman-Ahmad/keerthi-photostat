// Global state
let currentUser = null
let cart = []
let services = []
let currentCategory = "xerox"

// Mock data
const mockServices = {
  xerox: [
    {
      id: 1,
      name: "Black & White Xerox",
      price: 1.0,
      unit: "page",
      requiresFile: true,
      description: "Standard black and white photocopying",
    },
    {
      id: 2,
      name: "Color Xerox",
      price: 5.0,
      unit: "page",
      requiresFile: true,
      description: "Full color photocopying",
    },
    {
      id: 3,
      name: "Double-sided B&W Xerox",
      price: 1.5,
      unit: "page",
      requiresFile: true,
      description: "Double-sided black and white printing",
    },
    {
      id: 4,
      name: "Double-sided Color Xerox",
      price: 8.0,
      unit: "page",
      requiresFile: true,
      description: "Double-sided color printing",
    },
  ],
  lamination: [
    {
      id: 5,
      name: "A4 Lamination",
      price: 15.0,
      unit: "piece",
      requiresFile: true,
      description: "A4 size document lamination",
    },
    {
      id: 6,
      name: "A3 Lamination",
      price: 25.0,
      unit: "piece",
      requiresFile: true,
      description: "A3 size document lamination",
    },
  ],
  binding: [
    {
      id: 7,
      name: "Spiral Binding",
      price: 30.0,
      unit: "piece",
      requiresFile: true,
      description: "Spiral binding for documents",
    },
    {
      id: 8,
      name: "Glue Binding",
      price: 50.0,
      unit: "piece",
      requiresFile: true,
      description: "Professional glue binding",
    },
  ],
  stationery: [
    {
      id: 9,
      name: "Blue Pen",
      price: 10.0,
      unit: "piece",
      requiresFile: false,
      description: "Standard blue ballpoint pen",
    },
    {
      id: 10,
      name: "Black Pen",
      price: 10.0,
      unit: "piece",
      requiresFile: false,
      description: "Standard black ballpoint pen",
    },
    { id: 11, name: "Pencil", price: 5.0, unit: "piece", requiresFile: false, description: "HB pencil" },
    { id: 12, name: "Eraser", price: 5.0, unit: "piece", requiresFile: false, description: "White eraser" },
    {
      id: 13,
      name: "A4 Notebook",
      price: 80.0,
      unit: "piece",
      requiresFile: false,
      description: "200 pages ruled notebook",
    },
    {
      id: 14,
      name: "A5 Notebook",
      price: 40.0,
      unit: "piece",
      requiresFile: false,
      description: "100 pages ruled notebook",
    },
  ],
  snacks: [
    {
      id: 15,
      name: "Chocolate Bar",
      price: 25.0,
      unit: "piece",
      requiresFile: false,
      description: "Dairy Milk chocolate",
    },
    { id: 16, name: "Biscuits Pack", price: 15.0, unit: "piece", requiresFile: false, description: "Parle-G biscuits" },
    {
      id: 17,
      name: "Energy Drink",
      price: 120.0,
      unit: "piece",
      requiresFile: false,
      description: "Red Bull energy drink",
    },
  ],
}

const mockUsers = [
  { email: "test@nitc.ac.in", password: "password123", name: "Test User", phone: "+91-9876543210" },
  { email: "admin@nitc.ac.in", password: "password123", name: "Admin User", phone: "+91-9876543211" },
]

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
  loadServices()
  updateCartDisplay()

  // Check if user is logged in
  const savedUser = localStorage.getItem("currentUser")
  if (savedUser) {
    currentUser = JSON.parse(savedUser)
    updateAuthDisplay()
  }
})

function initializeApp() {
  // Set up event listeners
  setupEventListeners()

  // Load cart from localStorage
  const savedCart = localStorage.getItem("cart")
  if (savedCart) {
    cart = JSON.parse(savedCart)
    updateCartDisplay()
  }
}

function setupEventListeners() {
  // Close modals when clicking outside
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      closeAllModals()
    }
  })

  // Handle escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllModals()
    }
  })
}

// Navigation functions
function scrollToServices() {
  document.getElementById("services").scrollIntoView({ behavior: "smooth" })
}

function toggleMobileMenu() {
  const navMobile = document.getElementById("navMobile")
  const icon = document.getElementById("mobileMenuIcon")

  navMobile.classList.toggle("hidden")
  icon.className = navMobile.classList.contains("hidden") ? "fas fa-bars" : "fas fa-times"
}

function toggleUserDropdown() {
  const dropdown = document.getElementById("userDropdown")
  dropdown.classList.toggle("hidden")
}

// Authentication functions
function showLoginModal() {
  document.getElementById("loginModal").classList.remove("hidden")
}

function showRegisterModal() {
  document.getElementById("registerModal").classList.remove("hidden")
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.add("hidden")
}

function closeAllModals() {
  const modals = document.querySelectorAll(".modal-overlay")
  modals.forEach((modal) => modal.classList.add("hidden"))
}

function switchToRegister() {
  closeModal("loginModal")
  showRegisterModal()
}

function switchToLogin() {
  closeModal("registerModal")
  showLoginModal()
}

function togglePassword(inputId) {
  const input = document.getElementById(inputId)
  const button = input.nextElementSibling
  const icon = button.querySelector("i")

  if (input.type === "password") {
    input.type = "text"
    icon.className = "fas fa-eye-slash"
  } else {
    input.type = "password"
    icon.className = "fas fa-eye"
  }
}

function handleLogin(event) {
  event.preventDefault()

  const email = document.getElementById("loginEmail").value
  const password = document.getElementById("loginPassword").value

  // Validate NIT Calicut email
  if (!email.endsWith("@nitc.ac.in")) {
    showToast("error", "Invalid Email", "Please use your NIT Calicut email address")
    return
  }

  // Check credentials
  const user = mockUsers.find((u) => u.email === email && u.password === password)

  if (user) {
    currentUser = { ...user }
    delete currentUser.password // Remove password from stored user

    localStorage.setItem("currentUser", JSON.stringify(currentUser))
    updateAuthDisplay()
    closeModal("loginModal")
    showToast("success", "Login Successful", `Welcome back, ${user.name}!`)
  } else {
    showToast("error", "Login Failed", "Invalid email or password")
  }
}

function handleRegister(event) {
  event.preventDefault()

  const name = document.getElementById("registerName").value
  const email = document.getElementById("registerEmail").value
  const phone = document.getElementById("registerPhone").value
  const password = document.getElementById("registerPassword").value
  const confirmPassword = document.getElementById("confirmPassword").value

  // Validate NIT Calicut email
  if (!email.endsWith("@nitc.ac.in")) {
    showToast("error", "Invalid Email", "Please use your NIT Calicut email address")
    return
  }

  // Validate password
  if (password.length < 6) {
    showToast("error", "Weak Password", "Password must be at least 6 characters long")
    return
  }

  if (password !== confirmPassword) {
    showToast("error", "Password Mismatch", "Passwords do not match")
    return
  }

  // Check if user already exists
  if (mockUsers.find((u) => u.email === email)) {
    showToast("error", "User Exists", "User already exists with this email")
    return
  }

  // Create new user
  const newUser = { name, email, phone, password }
  mockUsers.push(newUser)

  showToast("success", "Registration Successful", "Account created successfully! Please login.")
  closeModal("registerModal")
  showLoginModal()
}

function logout() {
  currentUser = null
  localStorage.removeItem("currentUser")
  updateAuthDisplay()
  showToast("info", "Logged Out", "You have been logged out successfully")
}

function updateAuthDisplay() {
  const authButtons = document.getElementById("authButtons")
  const userMenu = document.getElementById("userMenu")

  if (currentUser) {
    authButtons.classList.add("hidden")
    userMenu.classList.remove("hidden")

    // Update user info
    document.getElementById("userInitial").textContent = currentUser.name.charAt(0)
    document.getElementById("userName").textContent = currentUser.name
    document.getElementById("userEmail").textContent = currentUser.email
  } else {
    authButtons.classList.remove("hidden")
    userMenu.classList.add("hidden")
  }
}

// Services functions
function loadServices() {
  services = mockServices
  showServiceCategory(currentCategory)
}

function showServiceCategory(category) {
  currentCategory = category

  // Update active tab
  document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"))
  event?.target?.classList.add("active") ||
    document.querySelector(`[onclick="showServiceCategory('${category}')"]`).classList.add("active")

  // Render services
  const servicesGrid = document.getElementById("servicesGrid")
  const categoryServices = services[category] || []

  servicesGrid.innerHTML = categoryServices.map((service) => createServiceCard(service)).join("")
}

function createServiceCard(service) {
  return `
        <div class="service-card">
            <div class="service-header">
                <div class="service-info">
                    <h3>${service.name}</h3>
                    <p>${service.description}</p>
                </div>
                <div class="service-price">₹${service.price}/${service.unit}</div>
            </div>
            
            <div class="service-options">
                <div class="form-group">
                    <label>Quantity:</label>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateServiceQuantity(${service.id}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="quantity-input" id="quantity-${service.id}" value="1" min="1" onchange="validateQuantity(${service.id})">
                        <button class="quantity-btn" onclick="updateServiceQuantity(${service.id}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                
                ${
                  service.requiresFile
                    ? `
                    <div class="form-group">
                        <label>Upload File:</label>
                        <div class="file-upload" onclick="triggerFileUpload(${service.id})" ondrop="handleFileDrop(event, ${service.id})" ondragover="handleDragOver(event)">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <p>Drag & drop a file here, or click to select</p>
                            <p style="font-size: 0.75rem; color: #6b7280;">Supports PDF, DOC, DOCX (max 50MB)</p>
                        </div>
                        <input type="file" id="file-${service.id}" accept=".pdf,.doc,.docx" style="display: none;" onchange="handleFileSelect(event, ${service.id})">
                        <div id="file-preview-${service.id}" class="file-preview hidden"></div>
                    </div>
                `
                    : ""
                }
                
                ${
                  currentCategory === "xerox"
                    ? `
                    <div class="form-group">
                        <label>Print Type:</label>
                        <select id="printType-${service.id}">
                            <option value="single">Single-sided</option>
                            <option value="double">Double-sided</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Paper Size:</label>
                        <select id="paperSize-${service.id}">
                            <option value="a4">A4</option>
                            <option value="a3">A3</option>
                            <option value="letter">Letter</option>
                        </select>
                    </div>
                `
                    : ""
                }
                
                <div class="form-group">
                    <label>Special Instructions (Optional):</label>
                    <textarea id="notes-${service.id}" placeholder="Any special requirements..." rows="2"></textarea>
                </div>
            </div>
            
            <div class="service-footer">
                <div class="service-total">
                    Total: ₹<span id="total-${service.id}">${service.price.toFixed(2)}</span>
                </div>
                <button class="btn btn-primary" onclick="addToCart(${service.id})">Add to Cart</button>
            </div>
        </div>
    `
}

function updateServiceQuantity(serviceId, change) {
  const quantityInput = document.getElementById(`quantity-${serviceId}`)
  let quantity = Number.parseInt(quantityInput.value) + change
  quantity = Math.max(1, quantity)
  quantityInput.value = quantity
  updateServiceTotal(serviceId)
}

function validateQuantity(serviceId) {
  const quantityInput = document.getElementById(`quantity-${serviceId}`)
  let quantity = Number.parseInt(quantityInput.value)
  if (isNaN(quantity) || quantity < 1) {
    quantity = 1
  }
  quantityInput.value = quantity
  updateServiceTotal(serviceId)
}

function updateServiceTotal(serviceId) {
  const service = findServiceById(serviceId)
  const quantity = Number.parseInt(document.getElementById(`quantity-${serviceId}`).value)
  const total = service.price * quantity
  document.getElementById(`total-${serviceId}`).textContent = total.toFixed(2)
}

function findServiceById(serviceId) {
  for (const category in services) {
    const service = services[category].find((s) => s.id === serviceId)
    if (service) return service
  }
  return null
}

function triggerFileUpload(serviceId) {
  document.getElementById(`file-${serviceId}`).click()
}

function handleFileSelect(event, serviceId) {
  const file = event.target.files[0]
  if (file) {
    displayFilePreview(serviceId, file)
  }
}

function handleFileDrop(event, serviceId) {
  event.preventDefault()
  event.stopPropagation()

  const files = event.dataTransfer.files
  if (files.length > 0) {
    const file = files[0]
    displayFilePreview(serviceId, file)
  }

  event.target.classList.remove("dragover")
}

function handleDragOver(event) {
  event.preventDefault()
  event.target.classList.add("dragover")
}

function displayFilePreview(serviceId, file) {
  const preview = document.getElementById(`file-preview-${serviceId}`)
  preview.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 0.25rem; margin-top: 0.5rem;">
            <i class="fas fa-file" style="color: #16a34a;"></i>
            <span style="flex: 1; font-size: 0.875rem;">${file.name}</span>
            <span style="font-size: 0.75rem; color: #6b7280;">${(file.size / (1024 * 1024)).toFixed(2)} MB</span>
            <button onclick="removeFile(${serviceId})" style="background: none; border: none; color: #dc2626; cursor: pointer;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `
  preview.classList.remove("hidden")
}

function removeFile(serviceId) {
  document.getElementById(`file-${serviceId}`).value = ""
  document.getElementById(`file-preview-${serviceId}`).classList.add("hidden")
}

// Cart functions
function addToCart(serviceId) {
  const service = findServiceById(serviceId)
  const quantity = Number.parseInt(document.getElementById(`quantity-${serviceId}`).value)
  const fileInput = document.getElementById(`file-${serviceId}`)
  const file = fileInput?.files[0]

  // Validate file requirement
  if (service.requiresFile && !file) {
    showToast("error", "File Required", "Please upload a file for this service")
    return
  }

  // Collect specifications
  const specifications = {
    notes: document.getElementById(`notes-${serviceId}`)?.value || "",
  }

  if (currentCategory === "xerox") {
    specifications.printType = document.getElementById(`printType-${serviceId}`)?.value
    specifications.paperSize = document.getElementById(`paperSize-${serviceId}`)?.value
  }

  // Check if item already exists in cart
  const existingItemIndex = cart.findIndex((item) => item.service.id === serviceId)

  if (existingItemIndex >= 0) {
    cart[existingItemIndex].quantity += quantity
    cart[existingItemIndex].specifications = specifications
    if (file) cart[existingItemIndex].file = file
  } else {
    const cartItem = {
      service,
      quantity,
      specifications,
      file: file || null,
    }
    cart.push(cartItem)
  }

  updateCartDisplay()
  saveCart()
  showToast("success", "Added to Cart", `${service.name} added to cart`)

  // Reset form
  document.getElementById(`quantity-${serviceId}`).value = 1
  if (fileInput) fileInput.value = ""
  document.getElementById(`file-preview-${serviceId}`)?.classList.add("hidden")
  document.getElementById(`notes-${serviceId}`).value = ""
  updateServiceTotal(serviceId)
}

function updateCartDisplay() {
  const cartCount = document.getElementById("cartCount")
  const cartItems = document.getElementById("cartItems")
  const cartTotal = document.getElementById("cartTotal")
  const checkoutBtn = document.getElementById("checkoutBtn")

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = cart.reduce((sum, item) => sum + item.service.price * item.quantity, 0)

  cartCount.textContent = `${totalItems} item${totalItems !== 1 ? "s" : ""}`
  cartTotal.textContent = totalAmount.toFixed(2)

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>'
    checkoutBtn.disabled = true
  } else {
    cartItems.innerHTML = cart.map((item, index) => createCartItem(item, index)).join("")
    checkoutBtn.disabled = false
  }
}

function createCartItem(item, index) {
  return `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.service.name}</h4>
                <p>₹${item.service.price} × ${item.quantity}</p>
                ${item.file ? `<p style="font-size: 0.75rem; color: #16a34a;"><i class="fas fa-file"></i> ${item.file.name}</p>` : ""}
            </div>
            <div class="cart-item-controls">
                <button onclick="updateCartItemQuantity(${index}, -1)">
                    <i class="fas fa-minus"></i>
                </button>
                <span style="font-size: 0.875rem; font-weight: 500; width: 2rem; text-align: center;">${item.quantity}</span>
                <button onclick="updateCartItemQuantity(${index}, 1)">
                    <i class="fas fa-plus"></i>
                </button>
                <button class="remove-btn" onclick="removeFromCart(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `
}

function updateCartItemQuantity(index, change) {
  if (index >= 0 && index < cart.length) {
    cart[index].quantity += change
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1)
    }
    updateCartDisplay()
    saveCart()
  }
}

function removeFromCart(index) {
  if (index >= 0 && index < cart.length) {
    const item = cart[index]
    cart.splice(index, 1)
    updateCartDisplay()
    saveCart()
    showToast("info", "Removed from Cart", `${item.service.name} removed from cart`)
  }
}

function saveCart() {
  // Convert cart to serializable format (without file objects)
  const serializableCart = cart.map((item) => ({
    service: item.service,
    quantity: item.quantity,
    specifications: item.specifications,
    fileName: item.file ? item.file.name : null,
  }))
  localStorage.setItem("cart", JSON.stringify(serializableCart))
}

function proceedToCheckout() {
  if (!currentUser) {
    showToast("error", "Login Required", "Please login to proceed with checkout")
    showLoginModal()
    return
  }

  if (cart.length === 0) {
    showToast("error", "Empty Cart", "Please add items to cart before checkout")
    return
  }

  showCheckoutModal()
}

function showCheckoutModal() {
  const modal = document.getElementById("checkoutModal")
  const content = document.getElementById("checkoutContent")

  content.innerHTML = createCheckoutContent()
  modal.classList.remove("hidden")
}

function createCheckoutContent() {
  const totalAmount = cart.reduce((sum, item) => sum + item.service.price * item.quantity, 0)

  return `
        <div class="checkout-steps">
            <div class="checkout-step active" id="step1">
                <h3>Review Your Order</h3>
                <div class="order-summary">
                    ${cart
                      .map(
                        (item) => `
                        <div class="order-item">
                            <div class="order-item-info">
                                <h4>${item.service.name}</h4>
                                <p>Quantity: ${item.quantity} × ₹${item.service.price}</p>
                                ${item.file ? `<p class="file-info"><i class="fas fa-file"></i> ${item.file.name}</p>` : ""}
                                ${item.specifications.notes ? `<p class="notes">Notes: ${item.specifications.notes}</p>` : ""}
                            </div>
                            <div class="order-item-total">₹${(item.service.price * item.quantity).toFixed(2)}</div>
                        </div>
                    `,
                      )
                      .join("")}
                    <div class="order-total">
                        <strong>Total: ₹${totalAmount.toFixed(2)}</strong>
                    </div>
                </div>
                <div class="checkout-actions">
                    <button class="btn btn-outline" onclick="closeModal('checkoutModal')">Back to Services</button>
                    <button class="btn btn-primary" onclick="proceedToScheduling()">Continue to Scheduling</button>
                </div>
            </div>
            
            <div class="checkout-step hidden" id="step2">
                <h3>Schedule Pickup</h3>
                <div class="scheduling-form">
                    <div class="form-group">
                        <label>Select Date:</label>
                        <input type="date" id="pickupDate" min="${new Date().toISOString().split("T")[0]}" max="${getMaxDate()}" onchange="loadTimeSlots()">
                    </div>
                    <div class="form-group">
                        <label>Select Time Slot:</label>
                        <div class="time-slots" id="timeSlots">
                            <p>Please select a date first</p>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Special Instructions (Optional):</label>
                        <textarea id="orderNotes" placeholder="Any special requirements or notes..." rows="3"></textarea>
                    </div>
                </div>
                <div class="checkout-actions">
                    <button class="btn btn-outline" onclick="backToReview()">Back to Review</button>
                    <button class="btn btn-primary" onclick="proceedToPayment()" disabled id="continueToPayment">Continue to Payment</button>
                </div>
            </div>
            
            <div class="checkout-step hidden" id="step3">
                <h3>Payment</h3>
                <div class="payment-info">
                    <div class="payment-method">
                        <div class="payment-icon">
                            <i class="fas fa-credit-card"></i>
                        </div>
                        <div>
                            <h4>Secure Payment</h4>
                            <p>Your payment will be processed securely. We accept all major credit cards and UPI payments.</p>
                        </div>
                    </div>
                    <div class="payment-summary">
                        <div class="summary-row">
                            <span>Subtotal:</span>
                            <span>₹${totalAmount.toFixed(2)}</span>
                        </div>
                        <div class="summary-row">
                            <span>Processing Fee:</span>
                            <span>₹0.00</span>
                        </div>
                        <div class="summary-row total">
                            <span>Total:</span>
                            <span>₹${totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                <div class="checkout-actions">
                    <button class="btn btn-outline" onclick="backToScheduling()">Back to Scheduling</button>
                    <button class="btn btn-primary" onclick="processPayment()">Place Order & Pay</button>
                </div>
            </div>
        </div>
    `
}

function getMaxDate() {
  const date = new Date()
  date.setDate(date.getDate() + 7)
  return date.toISOString().split("T")[0]
}

function proceedToScheduling() {
  document.getElementById("step1").classList.add("hidden")
  document.getElementById("step2").classList.remove("hidden")
}

function backToReview() {
  document.getElementById("step2").classList.add("hidden")
  document.getElementById("step1").classList.remove("hidden")
}

function proceedToPayment() {
  const selectedSlot = document.querySelector('input[name="timeSlot"]:checked')
  if (!selectedSlot) {
    showToast("error", "Time Slot Required", "Please select a pickup time slot")
    return
  }

  document.getElementById("step2").classList.add("hidden")
  document.getElementById("step3").classList.remove("hidden")
}

function backToScheduling() {
  document.getElementById("step3").classList.add("hidden")
  document.getElementById("step2").classList.remove("hidden")
}

function loadTimeSlots() {
  const dateInput = document.getElementById("pickupDate")
  const timeSlotsContainer = document.getElementById("timeSlots")
  const continueBtn = document.getElementById("continueToPayment")

  if (!dateInput.value) {
    timeSlotsContainer.innerHTML = "<p>Please select a date first</p>"
    continueBtn.disabled = true
    return
  }

  // Generate time slots (9 AM to 6 PM)
  const timeSlots = []
  for (let hour = 9; hour <= 17; hour++) {
    const startTime = `${hour.toString().padStart(2, "0")}:00`
    const endTime = `${(hour + 1).toString().padStart(2, "0")}:00`
    const availableSlots = Math.floor(Math.random() * 10) + 1 // Random availability

    timeSlots.push({
      id: `slot-${hour}`,
      startTime,
      endTime,
      availableSlots,
    })
  }

  timeSlotsContainer.innerHTML = `
        <div class="time-slots-grid">
            ${timeSlots
              .map(
                (slot) => `
                <label class="time-slot ${slot.availableSlots === 0 ? "disabled" : ""}">
                    <input type="radio" name="timeSlot" value="${slot.id}" ${slot.availableSlots === 0 ? "disabled" : ""} onchange="enableContinueButton()">
                    <div class="slot-time">${slot.startTime} - ${slot.endTime}</div>
                    <div class="slot-availability">
                        ${slot.availableSlots > 0 ? `${slot.availableSlots} slots available` : "Fully booked"}
                    </div>
                </label>
            `,
              )
              .join("")}
        </div>
    `
}

function enableContinueButton() {
  document.getElementById("continueToPayment").disabled = false
}

function processPayment() {
  // Simulate payment processing
  showToast("info", "Processing Payment", "Please wait while we process your payment...")

  setTimeout(() => {
    const orderId = "ORD-" + Date.now()
    const totalAmount = cart.reduce((sum, item) => sum + item.service.price * item.quantity, 0)

    // Clear cart
    cart = []
    updateCartDisplay()
    saveCart()

    // Close checkout modal
    closeModal("checkoutModal")

    // Show success message
    showPaymentSuccess(orderId, totalAmount)
  }, 2000)
}

function showPaymentSuccess(orderId, amount) {
  const successModal = `
        <div class="modal-overlay" id="successModal">
            <div class="modal">
                <div class="modal-body" style="text-align: center; padding: 2rem;">
                    <div style="color: #10b981; font-size: 4rem; margin-bottom: 1rem;">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h2 style="color: #10b981; margin-bottom: 1rem;">Payment Successful!</h2>
                    <p style="margin-bottom: 1.5rem;">Your order has been confirmed and payment of ₹${amount.toFixed(2)} has been processed successfully.</p>
                    
                    <div style="background: #f0fdf4; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                        <h3 style="color: #16a34a; margin-bottom: 0.5rem;">Order Details</h3>
                        <p>Order ID: ${orderId}</p>
                        <p>Amount: ₹${amount.toFixed(2)}</p>
                        <p>Status: Confirmed</p>
                    </div>
                    
                    <div style="background: #eff6ff; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                        <h3 style="color: #2563eb; margin-bottom: 0.5rem;">What's Next?</h3>
                        <ul style="text-align: left; font-size: 0.875rem; color: #1d4ed8;">
                            <li>• You'll receive an email confirmation shortly</li>
                            <li>• We'll notify you when your order is ready for pickup</li>
                            <li>• Show your order ID at the shop for collection</li>
                        </ul>
                    </div>
                    
                    <div style="display: flex; gap: 1rem; justify-content: center;">
                        <button class="btn btn-primary" onclick="closeModal('successModal')">Continue Shopping</button>
                    </div>
                    
                    <p style="font-size: 0.875rem; color: #6b7280; margin-top: 1rem;">
                        Need help? Contact us at <a href="mailto:keerthi@nitc.ac.in" style="color: #dc2626;">keerthi@nitc.ac.in</a>
                    </p>
                </div>
            </div>
        </div>
    `

  document.body.insertAdjacentHTML("beforeend", successModal)
}

// Toast notification system
function showToast(type, title, message) {
  const toastContainer = document.getElementById("toastContainer")
  const toastId = "toast-" + Date.now()

  const iconMap = {
    success: "fas fa-check-circle",
    error: "fas fa-exclamation-circle",
    info: "fas fa-info-circle",
  }

  const toast = document.createElement("div")
  toast.id = toastId
  toast.className = `toast ${type}`
  toast.innerHTML = `
        <div class="toast-icon">
            <i class="${iconMap[type]}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="removeToast('${toastId}')">
            <i class="fas fa-times"></i>
        </button>
    `

  toastContainer.appendChild(toast)

  // Auto remove after 5 seconds
  setTimeout(() => {
    removeToast(toastId)
  }, 5000)
}

function removeToast(toastId) {
  const toast = document.getElementById(toastId)
  if (toast) {
    toast.style.animation = "slideOut 0.3s ease forwards"
    setTimeout(() => {
      toast.remove()
    }, 300)
  }
}

// Add slideOut animation to CSS
const style = document.createElement("style")
style.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .time-slots-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 0.75rem;
    }
    
    .time-slot {
        display: block;
        padding: 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: center;
    }
    
    .time-slot:hover:not(.disabled) {
        border-color: #dc2626;
        background: #fef2f2;
    }
    
    .time-slot.disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background: #f9fafb;
    }
    
    .time-slot input[type="radio"] {
        display: none;
    }
    
    .time-slot input[type="radio"]:checked + .slot-time {
        color: white;
    }
    
    .time-slot:has(input[type="radio"]:checked) {
        background: #dc2626;
        border-color: #dc2626;
        color: white;
    }
    
    .slot-time {
        font-weight: 500;
        margin-bottom: 0.25rem;
    }
    
    .slot-availability {
        font-size: 0.75rem;
        opacity: 0.8;
    }
    
    .checkout-steps {
        max-width: 100%;
    }
    
    .checkout-step {
        margin-bottom: 2rem;
    }
    
    .order-summary {
        background: #f9fafb;
        border-radius: 0.5rem;
        padding: 1rem;
        margin-bottom: 1.5rem;
    }
    
    .order-item {
        display: flex;
        justify-content: space-between;
        align-items: start;
        padding: 0.75rem 0;
        border-bottom: 1px solid #e5e7eb;
    }
    
    .order-item:last-child {
        border-bottom: none;
    }
    
    .order-item-info h4 {
        font-weight: 500;
        margin-bottom: 0.25rem;
    }
    
    .order-item-info p {
        font-size: 0.875rem;
        color: #6b7280;
        margin-bottom: 0.25rem;
    }
    
    .file-info {
        color: #16a34a !important;
    }
    
    .notes {
        font-style: italic;
    }
    
    .order-item-total {
        font-weight: 600;
        color: #dc2626;
    }
    
    .order-total {
        text-align: right;
        padding-top: 0.75rem;
        border-top: 2px solid #dc2626;
        font-size: 1.125rem;
    }
    
    .checkout-actions {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        margin-top: 1.5rem;
    }
    
    .payment-method {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: #dbeafe;
        border-radius: 0.5rem;
        margin-bottom: 1.5rem;
    }
    
    .payment-icon {
        font-size: 2rem;
        color: #2563eb;
    }
    
    .payment-summary {
        background: #f9fafb;
        border-radius: 0.5rem;
        padding: 1rem;
        margin-bottom: 1.5rem;
    }
    
    .summary-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
    }
    
    .summary-row.total {
        border-top: 1px solid #d1d5db;
        padding-top: 0.5rem;
        font-weight: 600;
        font-size: 1.125rem;
        color: #dc2626;
    }
`
document.head.appendChild(style)
