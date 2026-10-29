/* T&T Mansion — โค้ดการทำงานทั้งหมด (เชื่อมกับ index.html ด้วย <script src="script.js">)
   ตั้งค่า Supabase: แก้ SB_CFG ด้านล่าง หรือกำหนด window.TTM_SB ในแท็กสคริปต์ก่อนหน้า */
        const LG = 'data:image/webp;base64,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';
        document.head.insertAdjacentHTML('beforeend', `<link rel="icon" href="${LG}">`);
        const PI = '<svg viewBox="0 0 24 24" width="1.05em" height="1.05em" fill="currentColor" style="vertical-align:-.15em"><circle cx="12" cy="7.5" r="4.2"/><path d="M3.5 21.5c0-4.9 3.8-8.3 8.5-8.3s8.5 3.4 8.5 8.3z"/></svg>';
        let LANG = 'th',
            THEME = 'light',
            PF = {};
        try {
            PF = JSON.parse(localStorage.getItem('ttm_pf') || '{}')
        } catch (x) {}
        const LOCF = () => LANG == 'en' ? 'en-GB' : 'th-TH',
            ENm = `กฎการเรียกเก็บค่าบริการของหอพัก|Dorm billing rules
กฎการเรียกเก็บเงิน|Billing rules
กดค้างที่รูป (มือถือ) หรือคลิกขวา (คอมพิวเตอร์) แล้วเลือกบันทึกรูปภาพ|Long-press the image (mobile) or right-click (desktop), then choose Save image
กดแก้ไขเพื่อเพิ่ม)|press Edit to add)
กรอกข้อมูลให้ครบ (ชื่อ เพศ เบอร์โทร อีเมล และรหัสผ่านอย่างน้อย|Please fill in everything (name, gender, phone, email, password of at least
กรอกข้อมูลให้ครบ|Please fill in all fields
กรอกชื่อและอีเมล|Enter name and email
กรอกหมวดหมู่ หัวข้อ และรายละเอียดให้ครบ|Fill in category, subject and details
กรอกหัวข้อและรายละเอียด|Enter subject and details
กรุณาอธิบายปัญหาอย่างละเอียด|Please describe the problem in detail
กรุณาอัปโหลดสลิปโอนเงิน|Please upload the transfer slip
กรุณาเลือกรูปที่เล็กกว่านี้|Please choose a smaller image
กลับ|Back
กลุ่มผู้ใช้งาน เจ้าของ · ผู้ดูแล · ผู้เช่า|user groups: owner · admin · tenant
กลุ่ม|groups
กล่องอีเมลอัตโนมัติ|Automatic email box
การดำเนินการด่วน|Quick actions
การแสดงผล|Display
กำลังดำเนินการ|In progress
กำลังสร้างรูปใบเสร็จ|Creating receipt image
กำลังส่ง|Sending
ของเดือนถัดไป มีค่าปรับวันละ|of next month; late fee per day:
ของเดือนถัดไป|of next month
ของเดือน|of month
ขอบคุณที่ใช้บริการ|Thank you for your payment
ขั้นตอนชำระเงิน|Payment steps
ขั้นตอน|steps
ขึ้นอัตโนมัติ|automatic
ข่าวสาร|News
ข้อมูลการชำระเงิน|Payment information
ข้อมูลจากใบเรียกเก็บเงินและห้องพักทั้งหมด|Data from all invoices and rooms
ข้อมูลฉบับนี้บันทึกไว้ในเครื่องนี้|This data is saved on this device
ข้อมูลส่วนตัว|Personal information
ข้อมูลไม่ครบหรืออีเมลซ้ำ|Incomplete data or duplicate email
ครบกำหนดวันที่|Due on day
ครบกำหนด|Due
ครบทุกขั้นตอนการเก็บค่าหอพัก|Every step of dorm fee collection
ครอปรูปโปรไฟล์|Crop profile photo
ครอปรูปได้ก่อนบันทึก|crop before saving
ครั้งต่อไปให้เข้าสู่ระบบด้วยรหัสผ่านใหม่|Next time, sign in with your new password
ครั้ง|times
คลิกห้องเพื่อแก้ไขข้อมูล|Click a room to edit
คำขอของฉัน|My requests
คำขอทั้งหมด|All requests
คุณ|you
ค่าน้ำฟรี|Free water
ค่าปรับ (นับถึงวันที่แจ้งชำระ)|Late fee (up to the notice date)
ค่าปรับที่เก็บได้|Late fees collected
ค่าปรับล่าช้า|Late fee
ค่าปรับสูงสุด|Max late fee
ค่าปรับ|Late fee
ค่าเช่าต่อเดือน|Monthly rent
ค่าเช่าล่วงหน้า) บันทึกครั้งเดียว ณ วันเริ่มสัญญา|advance rent), recorded once at contract start
ค่าเช่าห้องพัก|Room rent
ค่าเช่าห้อง|Room rent
ค่าเช่า|Rent
ค่าใช้จ่ายเพิ่มเติม|Additional charges
ค่าไฟต่อหน่วย คำนวณอัตโนมัติ|electricity per unit, auto-calculated
ค่าไฟฟ้า|Electricity
ค่าไฟ|Electricity
ค้นหาผู้เช่า|Search tenants
ค้นหาห้อง / ผู้เช่า|Search room / tenant
ค้นหาห้อง ผู้เช่า หรือเลขที่บิล (กด|Search room, tenant or invoice no. (press
ค้างชำระ|Overdue
จดมิเตอร์วันที่|Meter reading on day
จดเลขมิเตอร์ คำนวณหน่วยไฟอัตโนมัติ|Record meter readings; electricity units calculated automatically
จะย้ายผู้เช่า|will move the tenant
จัดผู้เช่าที่ลงทะเบียนแล้วเข้าห้องนี้|Assign a registered tenant to this room
จัดการห้อง สถานะ และผู้เช่า|Manage rooms, status and tenants
จัดการห้อง|Manage room
จัดเข้าห้อง|Assign to room
จัดห้องให้|Assign a room to
จัดห้อง|Assign room
จำนวนบิล|Number of invoices
จำนวนรอบบิล|Billing cycles
จำนวนเงิน (บาท)|Amount (THB)
จำนวนเงิน|Amount
จำรหัสผ่านได้แล้ว|Remembered your password
จ่ายตรงเวลา|Paid on time
ฉันมีบัญชีอยู่แล้ว|I already have an account
ชั้น|Floor
ชาย|Male
ชำระเงินง่ายใน|Pay easily in
ชำระเงินผ่าน|Pay via
ชำระเงินแล้ว|Payment received
ชำระเงิน|Payment
ชำระเมื่อ|Paid on
ชำระแล้ว|Paid
ชำระผ่าน|Pay via
ชำระหลังวันที่|Pay after day
ชำระ|Pay
ชื่อ - นามสกุล|Full name
ชื่อผู้รับเงิน|Payee name
ชื่อหอพัก (บนเอกสาร)|Dorm name (on documents)
ช่วงเวลา|Period
ช่วยเหลือ|Help
ช่องทางการชำระเงิน|Payment channels
ช่องทางการติดต่อ|Contact channels
ช้าเฉลี่ย|Avg. late
ซูม|Zoom
ซ่อมบำรุง|Maintenance
ซ่อน|Hide
ดูทั้งหมด|View all
ดูรายละเอียด|Details
ดูห้อง|View room
ดูอีเมล|View email
ดูและแก้ไขข้อมูลส่วนตัว|View and edit your personal information
ดูใบแจ้งหนี้ของห้องคุณ|View your room's invoice
ดูใบแจ้งหนี้ / ชำระเงิน|View invoice / pay
ดูใบแจ้งหนี้|View invoice
ด้วยแอปธนาคาร|with your banking app
ตกลง|OK
ตรวจสอบสลิป อนุมัติ/ปฏิเสธ และรับเงินสด|Review slips, approve/reject and receive cash
ตรวจสอบสลิป|Review slips
ตัวเลขอ้างอิงจากการตั้งค่าของหอพัก|Figures based on the dorm's settings
ตั้งค่าทรัพย์สิน|Property settings
ตั้งค่าระบบ|System settings
ตั้งค่าแล้ว|Configured
ตั้งค่า|Settings
ตั้งรหัสผ่านใหม่สำเร็จ กรุณาเข้าสู่ระบบ|New password set. Please sign in
ตั้งรหัสผ่านใหม่|Set new password
ตามยอดสุทธิของใบแจ้งหนี้อัตโนมัติ|QR is generated automatically from the invoice total
ติดต่อเราผ่านช่องทางที่คุณสะดวก|Contact us through your preferred channel
ต่อรูป|per image
ต่อไป|Next
ต้องการออกบิลต่อหรือไม่|Do you want to continue issuing invoices?
ต้องดำเนินการ|Action required
ถึง|to
ทดลองใช้งาน|Try demo
ทั้งหมด|All
ที่ตั้ง|Location
ที่อยู่|Address
บัญชีนี้ย้ายออกแล้ว กรุณาติดต่อผู้ดูแล|This account has moved out. Please contact the admin
บัญชีผู้ใช้|User account
บันทึกการตั้งค่า|Save settings
บันทึกข้อมูลผู้เช่าแล้ว|Tenant saved
บันทึกข้อมูลแล้ว|Saved
บันทึกข้อมูล|Save
บันทึกรูปใบเสร็จแล้ว|Receipt image saved
บันทึกรูปใบเสร็จ|Save receipt image
บันทึกสถานะห้อง|Save room status
บันทึกสถานะ|Save status
บันทึกสัญญาและเงินแรกเข้า|Record contracts and initial deposit
บันทึกสัญญาแล้ว|Contract saved
บันทึกเลขมิเตอร์|Record meter readings
บันทึกแล้ว|Saved
บันทึก|Save
บาท สูงสุด|baht max
บาท/หน่วย|baht/unit
บาท/เดือน|baht/month
บาท|baht
ปฏิเสธ|Reject
ประกาศข่าวแล้ว|News posted
ประกาศข่าว|Post news
ประกาศและข่าวสารจาก|Announcements and news from
ประกาศ|Announce
ประวัติชำระ|Payment history
ประวัติ|History
ปัจจุบัน|Current
ปัญหาการชำระเงิน|Payment problem
ปิดปรับปรุง|Under renovation
ปิด|Close
ปีนี้|This year
ผิดนัดชำระ|Defaulted
ผู้จ่ายเงิน|Payer
ผู้ดูแลยังไม่ได้เพิ่ม)|admin has not added one yet)
ผู้ดูแลระบบ|Administrator
ผู้ดูแลอนุมัติ รับใบเสร็จ|Admin approves, you get a receipt
ผู้ดูแล|Admin
ผู้รับเงิน|Payee
ผู้เช่าทั้งหมด|All tenants
ผู้เช่าที่ชำระสูงสุด|Top paying tenants
ผู้เช่าปัจจุบัน|Current tenant
ผู้เช่า|Tenants
กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ (ตรวจสอบกล่องจดหมายของคุณ)|Please confirm your email before signing in (check your inbox)
ลงทะเบียนสำเร็จ กรุณายืนยันอีเมลผ่านลิงก์ที่ส่งไป แล้วเข้าสู่ระบบ|Registered. Please confirm your email via the link we sent, then sign in
ส่งลิงก์ตั้งรหัสผ่านใหม่ไปที่อีเมลแล้ว กรุณาตรวจสอบกล่องจดหมาย|A password reset link was sent to your email. Please check your inbox
ตั้งรหัสผ่านใหม่สำเร็จ กรุณาเข้าสู่ระบบ|Password updated. Please sign in
ส่งลิงก์ตั้งรหัสผ่านใหม่|Send reset link
ส่งลิงก์รีเซ็ตทางอีเมล|Reset link by email
กรอกอีเมลที่ลงทะเบียนไว้ ระบบจะส่งลิงก์ตั้งรหัสผ่านใหม่ให้ทางอีเมล|Enter your registered email and we will send a reset link
บันทึกรหัสผ่านใหม่|Save new password
จากลิงก์ในอีเมล|From the email link
กรอกรหัสผ่านใหม่ของคุณ|Enter your new password
เชื่อมต่อ Supabase ไม่สำเร็จ:|Could not connect to Supabase:
บันทึกไม่สำเร็จ:|Could not save:
กำลังส่งอีเมลอีกครั้ง…|Sending the email again…
อัปโหลดสลิปไม่สำเร็จ:|Slip upload failed:
อัปโหลดไม่สำเร็จ:|Upload failed:
อัปโหลดรูปไม่สำเร็จ:|Image upload failed:
เปิดไฟล์ไม่สำเร็จ|Could not open the file
ไม่พบข้อมูลบัญชีในระบบ|Account data not found
กรอกอีเมลและรหัสผ่าน|Enter email and password
กรอกอีเมล|Enter email
กรอกชื่อ อีเมล และรหัสผ่านอย่างน้อย 6 ตัว|Enter name, email and a password of at least 6 characters
สร้างบัญชีแล้วแต่ยังไม่พบข้อมูล กรุณารีเฟรชหน้า|Account created but not found yet. Please refresh
กรอกชื่อ|Enter name
เบอร์โทรติดต่อ|Contact numbers
ยังไม่ได้ตั้งค่าเบอร์โทร|Phone number not set
ตอบกลับจากผู้ดูแลระบบ|Reply from the administrator
พิมพ์ข้อความตอบกลับ|Type a reply
ส่งคำตอบแล้ว|Reply sent
ส่งคำตอบ|Send reply
คำขอจากผู้ใช้ (ช่วยเหลือผู้ส่งคำขอ)|Requests from users (help the senders)
/เดือน|/month
/ เดือน|/ month
/หน่วย|/unit
 ให้ | for 
พร้อมเพย์สำหรับใบเรียกเก็บเงิน|PromptPay for invoices
พื้นที่จัดเก็บของเบราว์เซอร์จำกัด)|browser storage is limited)
พื้นที่จัดเก็บเต็ม ไม่สามารถเก็บไฟล์นี้ได้|Storage is full; this file cannot be saved
พื้นที่จัดเก็บเต็ม|Storage is full
พื้นที่ใส่|Area for
พิมพ์ / PDF|Print / PDF
พิมพ์|Print
ฟีเจอร์|Features
ภาพรวมการจัดการ|Management overview
ภาพรวมการชำระค่าบริการของ|Overview of service payments for
มัดจำ|deposit
มิเตอร์ไฟฟ้า|Electricity meter
มิเตอร์|Meter
มีบิลค้างชำระ|Has overdue invoices
มีบิลค้าง|Overdue invoices:
มีผลบังคับใช้|Active
มีผู้เช่าอยู่แล้ว|Already has a tenant
มีผู้เช่า|Occupied
มีบัญชีแล้ว|Already have an account
ยกเลิก|Cancel
ยอดขึ้นอัตโนมัติ|amount filled automatically
ยอดชำระทั้งสิ้น|Total paid
ยอดที่ชำระแล้วเทียบกับยอดรวมสูงสุดของเดือน|Paid amount vs. the month's highest total
ยอดที่ชำระ|Amount paid
ยอดที่ต้องชำระ|Amount due
ยอดรวม|Total
ยอดสุทธิ|Net total
ยอดเงินจะขึ้นอัตโนมัติ ไม่ต้องกรอกเอง|The amount is filled in automatically
ยอดเงินที่ได้รับ|Amount received
ยอด|Amount
ยังอยู่|Still active
ยังไม่จัดห้อง|Not assigned
ยังไม่ชำระ|Unpaid
ยังไม่ถึงวันจดมิเตอร์|Not yet meter reading day
ยังไม่มีข่าวสาร|No news yet
ยังไม่มีข้อมูล|No data yet
ยังไม่มีคำขอ|No requests yet
ยังไม่มีบัญชี|No account yet
ยังไม่มีบันทึก|No records yet
ยังไม่มีบิล|No invoices yet
ยังไม่มีประวัติ|No history yet
ยังไม่มีรายการ|No items yet
ยังไม่มีรูป|No image yet
ยังไม่มีอีเมล|No emails yet
ยังไม่มีใบเรียกเก็บเงิน|No invoices yet
ยังไม่มีไฟล์|No file yet
ยังไม่ได้กรอกเลขมิเตอร์ใหม่|New meter reading not entered
ยังไม่ได้จัดห้อง|Not assigned to a room
ยังไม่ได้ตั้งค่า|Not set
ยินดีต้อนรับกลับ|Welcome back
ยินดีต้อนรับสู่|Welcome to
ยืนยันตัวตนด้วยอีเมลและเบอร์โทรที่ลงทะเบียนไว้ แล้วตั้งรหัสผ่านใหม่|Verify with your registered email and phone, then set a new password
ยืนยันย้ายออก|Confirm move-out
ยืนยันรหัสผ่านใหม่|Confirm new password
ยืนยันรหัสผ่านไม่ตรงกัน|Passwords do not match
ยืนยันรับเงินสดห้อง|Confirm cash received for room
ยืนยัน|Confirm
ย้อนหลัง|Last
ย้ายกลับเข้าพักแล้ว|Moved back in
ย้ายกลับเข้าพัก|Move back in
ย้ายออกแล้ว|Moved out
ย้ายออก|Move out
รวม (ก่อนค่าปรับ)|Total (before late fee)
รวมทั้งปี|Year total
รหัสผ่านปัจจุบันไม่ถูกต้อง|Current password is incorrect
รหัสผ่านปัจจุบัน|Current password
รหัสผ่านสั้นเกินไป|Password is too short
รหัสผ่านใหม่ (เว้นว่างถ้าไม่เปลี่ยน)|New password (leave blank to keep)
รหัสผ่านใหม่ (อย่างน้อย|New password (at least
รหัสผ่านใหม่ต้องมีอย่างน้อย|New password must be at least
รหัสผ่าน (อย่างน้อย|Password (at least
รหัสผ่าน|Password
รองรับผู้ใช้งาน|Supports
รองรับเฉพาะไฟล์|Only files of type
รองรับเฉพาะ|Only supports
รองรับ|Supports
รอจัดห้อง|Awaiting room
รอดำเนินการ|Pending
รอตรวจสอบ|Under review
รอตั้งค่า|Awaiting setup
รอบบิลปัจจุบัน|Current billing cycle
รอบบิล|Billing cycle
รอผู้ดูแลจัดห้อง|Waiting for admin to assign a room
รอผู้ดูแลตรวจสอบ|Waiting for admin review
ระบบชำระค่าบริการของหอพัก|Dormitory service payment system
ระบุวันเริ่มสัญญา|Enter the contract start date
ระยะเช่าเฉลี่ย|Avg. rental period
รับชำระเงิน|Receive payments
รับเงินสด (เคาน์เตอร์)|Receive cash (counter)
รับเงินสด|Receive cash
รายการ จะยังอยู่ในประวัติของผู้เช่าคนนี้|items will remain in this tenant's history
รายการ จะยังอยู่ในประวัติผู้เช่าเดิม|items will remain in the previous tenant's history
รายการ|items
รายงานรายรับ|Revenue report
รายงาน|Reports
รายรับค่าไฟ|Electricity revenue
รายรับตามประเภท|Revenue by type
รายรับรวม|Total revenue
รายรับเดือนนี้|This month's revenue
รายรับ|Revenue
รายละเอียด|Details
รายได้ตามประเภท|Income by type
รายได้เดือนนี้|Income this month
รายได้|Income
ราย|persons
รีเฟรช|Refresh
รูปแบบอีเมลไม่ถูกต้อง|Invalid email format
รูป|image
ลงทะเบียนสำเร็จ รอผู้ดูแลจัดห้องพักให้|Registered successfully. Please wait for the admin to assign your room
ลงทะเบียนสำเร็จแล้ว รอผู้ดูแลจัดห้องพักให้ จึงจะมีใบแจ้งหนี้|Registered. Invoices will appear once the admin assigns your room
ลงทะเบียนแล้วผู้ดูแลจะเป็นผู้จัดห้องพักให้ภายหลัง|After registering, the admin will assign your room
ลงทะเบียนใหม่|Register
ปฏิเสธสลิป|Reject slip
ผู้เช่าจะเห็นเหตุผลนี้ในหน้าใบแจ้งหนี้ แล้วส่งสลิปใหม่ได้|The tenant will see this reason on the invoice page and can resend a slip
ยืนยันปฏิเสธ|Confirm rejection
รายละเอียดเพิ่มเติม (ไม่บังคับ)|Additional details (optional)
กรุณาตรวจสอบแล้วส่งสลิปใหม่|Please check and resend the slip
สลิปโอนเงินและใบเสร็จของผู้เช่า|Tenant payment slips & receipts
สลิปที่ผู้เช่าส่งมาทุกห้อง และใบเสร็จเมื่อผู้ดูแลยืนยันการชำระแล้ว|Slips sent by tenants of every room, and receipts once the admin confirms payment
วันที่แจ้งชำระ|Date notified
ดูทั้งหมด (|View all (
แก้ไขบิล|Edit invoice
แก้ไข/ส่งสลิปใหม่|Edit / resend slip
ส่งสลิปใหม่|Resend slip
แก้ไขสลิป · ส่งสลิปใหม่|Edit slip · resend
ใบเสร็จรับเงินของผู้เช่า|Tenant receipts
ใบเสร็จที่ออกให้ผู้เช่าเมื่อผู้ดูแลยืนยันการชำระ|Receipts issued to tenants once the admin confirms payment
ยังไม่มีใบเสร็จ|No receipts yet
เริ่มใช้งาน →|Get started →
เริ่มใช้งาน|Get started
ยังไม่มีบัญชี? ติดต่อผู้ดูแลหอพักเพื่อขอสร้างบัญชี|No account yet? Contact the dormitory admin to create one
เข้าสู่ระบบ →|Sign in →
ลบข่าวนี้|Delete this news?
ลบข่าว|Delete news
ลบรูปแล้ว|Image removed
ลบรูปโปรไฟล์|Remove profile photo
ลบรูป|Remove image
ลบไฟล์สัญญา ห้อง|Deleted contract file, room
ลบไฟล์สัญญาห้อง|Delete contract file for room
ลบ|Delete
ลากเพื่อจัดตำแหน่ง · เลื่อนแถบเพื่อซูม|Drag to position · slide to zoom
ลำดับ|No.
ลิงก์เว็บระบบ (ใส่ในอีเมล)|System link (included in emails)
ลืมรหัสผ่าน|Forgot password
วันครบกำหนดชำระ|Payment due day
วันที่ชำระ|Payment date
วันที่รับเงิน|Date received
วันสิ้นสุดต้องไม่ก่อนวันเริ่มสัญญา|End date must not be before start date
วันสิ้นสุดสัญญา (เว้นว่างได้)|Contract end date (optional)
วันเริ่มสัญญา|Contract start date
วัน|days
วิธีชำระ|Payment method
วิเคราะห์เชิงลึก|Insights
ว่าง|Vacant
ศูนย์ช่วยเหลือ|Help center
สถานะผู้เช่า|Tenant status
สถานะห้องจะเปลี่ยนเป็น|Room status will change to
สถานะห้องพัก|Room status
สถานะห้อง|Room status
สถานะ: ทั้งหมด|Status: All
สถานะ|Status
สมัครสมาชิก|Sign up
สรุปรายรับที่ชำระแล้วในช่วงเวลาที่เลือก พิมพ์เป็น|Summary of paid revenue for the selected period. Print as
สรุปรายเดือน|Monthly summary
สรุปรายได้และสถานะการชำระเงิน|Summary of income and payment status
สร้างบัญชีและเข้าสู่ระบบ|Create account and sign in
สร้างรูปไม่สำเร็จ|Could not create the image
สร้าง|Create
สลิป|Slip
สัญญาเช่า ห้อง|Lease, room
สัญญาเช่า|Lease
สัญญา|Contract
สำหรับผู้เช่าและผู้ดูแล|For tenants and admins
สิ้นสุดสัญญา|Contract ended
สิ้นสุด|End
สูงสุด|max
สแกน|Scan
สว่าง|Light
ส่งคำขอช่วยเหลือ|Send help request
ส่งคำขอแล้ว เราจะตอบกลับโดยเร็วที่สุด|Request sent. We will reply as soon as possible
ส่งคำขอใหม่|New request
ส่งคำขอ|Send request
ส่งซ้ำ|Resend
ส่งออกแล้ว|Exported
ส่งออก|Export
ส่งแล้ว|Sent
ส่งไม่สำเร็จ|Send failed
หญิง|Female
หน่วยไฟที่เรียกเก็บ|Electricity units billed
หน่วย|units
หน้าหลัก|Home
หน้าแรก|Home
หมวดหมู่|Category
หมายเหตุ|Note
หรือค้นหา|or search
หรือส่งออก|or export
หรือ|or
หอพัก · พิษณุโลก|Dormitory · Phitsanulok
หัวข้อ|Subject
หากต้องการชำระเงินสด สามารถชำระได้ที่หน้าเคาน์เตอร์|To pay in cash, please pay at the front counter
หากบัญชียังไม่มีเบอร์โทร (เช่น ผู้ดูแลระบบ) ให้ติดต่อผู้ดูแลเพื่อรีเซ็ตรหัสผ่านให้|If the account has no phone number (e.g. administrator), contact the admin to reset the password
ห้อง · เพิ่มคิวส่งอีเมลแล้ว|Room · email queued
ห้อง รอบ|Room, cycle
ห้องทั้งหมด|Total rooms
ห้องที่จ่ายช้า|Late-paying rooms
ห้องปรับอากาศ|Air-conditioned room
ห้องพัก (แก้ไขได้โดยผู้ดูแล)|Room (editable by admin)
ห้องพักที่จัดการในระบบ|rooms managed in the system
ห้องพัก|Rooms
ห้องรายรับสูงสุด|Top revenue rooms
ห้อง|Room
อดีตผู้เช่า|Former tenants
อดีต|Former
อธิบายปัญหาโดยย่อ|Briefly describe the problem
อนุมัติ|Approve
ออกจากระบบ|Sign out
ออกจากห้อง|from the room
ออกบิลทุกห้อง พร้อมค่าปรับอัตโนมัติ|Issue invoices for every room with automatic late fees
ออกบิลวันที่|Issue invoices on day
ออกบิล|Issue invoices
ออกใบแจ้งหนี้|Issue invoices
อัตราการเข้าพัก|Occupancy rate
อัปเดตสถานะแล้ว|Status updated
อัปโหลดสลิปโอนเงิน|Upload transfer slip
อัปโหลดไฟล์สัญญา ห้อง|Uploaded contract file, room
อัปโหลด|Upload
อาคารและห้อง|Building and rooms
อาคาร|Building
อายุหนี้ค้างชำระ|Overdue aging
อีเมลนี้ถูกใช้แล้ว|This email is already in use
อีเมลหรือรหัสผ่านไม่ถูกต้อง|Incorrect email or password
อีเมล|Email
อื่นๆ / ค่าปรับ|Other / late fees
อื่นๆ|Other
อ้างอิงใบแจ้งหนี้|Invoice reference
เก็บเงินเดือนนี้|Collection this month
เก็บเงิน|Collection
เข้าสู่ระบบเพื่อตรวจสอบบิลและสถานะการชำระเงินของห้องพัก|Sign in to check your bills and payment status
เข้าสู่ระบบ|Sign in
เงินสด|Cash
เงินแรกเข้า|Initial deposit
เจ้าของกิจการ|Business owner
เจ้าของหอพัก|Dorm owner
เจ้าของ|Owner
เฉพาะห้องว่าง|Vacant rooms only
เฉลี่ยต่อบิล|Avg. per invoice
เช่น ค่าซ่อม|e.g. repair fee
เช่น|e.g.
เดือนที่แล้ว|Last month
เดือนล่าสุด|latest months
เดือน|months
เทียบเดือนก่อน|vs. previous month
เบอร์/เลข ปชช.)|phone/ID no.)
เบอร์ติดต่อ|Contact number
เบอร์โทรที่ลงทะเบียน|Registered phone number
เบอร์โทรไม่ตรงกับที่ลงทะเบียนไว้|Phone number does not match the registered one
เบอร์โทรไม่ถูกต้อง (เช่น|Invalid phone number (e.g.
เบอร์โทรไม่ถูกต้อง|Invalid phone number
เบอร์โทร|Phone
เปลี่ยนรหัสผ่านสำเร็จ|Password changed successfully
เปลี่ยนรหัสผ่าน|Change password
เปลี่ยนรูปโปรไฟล์แล้ว|Profile photo changed
เปลี่ยนรูปโปรไฟล์|Change profile photo
เปลี่ยนสถานะคำขอ|Changed request status
เปลี่ยนเป็น|Change to
เปลี่ยน|Change
เปิดในแท็บใหม่|Open in new tab
เพศ|Gender
เพิ่มผู้เช่า ห้อง|Add tenant, room
เพิ่มผู้เช่า|Add tenant
เพิ่มเพื่อนใน|Add friend on
เพื่อย้ายผู้เช่าออกพร้อมเปลี่ยนสถานะห้อง|to move the tenant out and change the room status
เพื่อเพิ่มเพื่อน|to add friend
เราจะตอบกลับโดยเร็วที่สุด|we will reply as soon as possible
เริ่มต้นบัญชีผู้เช่า|Start a tenant account
เริ่มต้นใช้งาน|Get started
เริ่มสัญญา|Start
เรียกเก็บ|Billing
เรื่อง|Subject
เลขก่อนหน้า|Previous reading
เลขที่ใบเสร็จ|Receipt no.
เลขที่บิล|Invoice no.
เลขที่|No.
เลขประจำตัวผู้เสียภาษี|Tax ID
เลขมิเตอร์ต้องไม่น้อยกว่าเดิม|Meter reading must not be lower than before
เลขมิเตอร์ล่าสุด|Latest meter reading
เลขล่าสุด|Latest reading
เลยกำหนด|Overdue by
เลือกรูป|Choose image
เลือกหมวดหมู่|Select category
เลือกห้องว่าง|Select a vacant room
เลือกเพศ|Select gender
เลือก|Select
เวลา|Time
เสร็จสิ้น|Completed
แก้ไขกฎการคำนวณค่าบริการ|Edit fee calculation rules
แก้ไขการตั้งค่า|Edit settings
แก้ไขข้อมูลผู้เช่า|Edit tenant information
แก้ไขค่าอื่น|Edit other charges
แก้ไขช่องทาง|Edit channels
แก้ไขผู้เช่า|Edit tenant
แก้ไขวันที่|Edit dates
แก้ไขสถานะห้อง|Edit room status
แก้ไขสัญญา ห้อง|Edited contract, room
แก้ไขแล้วกดบันทึก ระบบจะใช้กับใบแจ้งหนี้รอบถัดไป|Edit and save; the system will apply it to the next invoices
แก้ไขโปรไฟล์|Edit profile
แก้ไข|Edit
แจ้งชำระเงินแล้ว รอผู้ดูแลตรวจสอบ|Payment reported. Waiting for admin review
แจ้งชำระเงิน|Report payment
แจ้งชำระ|Report payment
แดชบอร์ดผู้ดูแลระบบ|Admin dashboard
แดชบอร์ด|Dashboard
แนบรูปภาพ (ไม่บังคับ)|Attach images (optional)
แนบรูปภาพ|Attach images
แนบสลิปโอนเงิน|Attach transfer slip
แนบได้สูงสุด|Up to
แนวโน้มรายรับ|Revenue trend
แบบออนไลน์เรียลไทม์|online in real time
แมนชั่น|Mansion
และแนบสลิป|and attach the slip
แล้ว|already
แสดง|Show
แอร์ทุกห้อง|Air-conditioned rooms
โทร|Phone
โปรไฟล์ของฉัน|My profile
โปรไฟล์|Profile
โหลดตัวสร้างรูปไม่สำเร็จ กรุณารีเฟรชหน้าแล้วลองใหม่|Could not load the image generator. Please refresh and try again
โอนเงิน|Transfer
ใกล้หมดสัญญา|Expiring soon
ใช้รูปนี้|Use this image
ใช้ได้ทั้งมือถือและคอมพิวเตอร์|Works on mobile and desktop
ใช้ได้เมื่อบัญชีมีเบอร์โทร|Available when the account has a phone number
ใช้งาน|Active
ใช้|Use
ในระบบ แล้วแนบสลิปโอนเงิน|in the system, then attach the transfer slip
ในหน้าตั้งค่า|on the Settings page
ใบที่ชำระแล้ว|Paid invoices
ใบเรียกเก็บชำระแล้ว|invoices paid
ใบเรียกเก็บที่ออก|invoices issued
ใบเรียกเก็บเงินที่ชำระแล้ว|Paid invoices
ใบเรียกเก็บเงินล่าสุด|Latest invoices
ใบเสร็จรับเงิน|Receipt
ใบเสร็จ|Receipt
ใบแจ้งหนี้ของฉัน|My invoices
ใบแจ้งหนี้ประจำเดือน|Monthly invoices
ใบแจ้งหนี้ส่งเมื่อออกบิล · ใบเสร็จส่งเมื่อยืนยันการชำระ|Invoices are sent when issued · receipts when payment is confirmed
ใบแจ้งหนี้ / ค่าไฟ|Invoice / electricity
ใบแจ้งหนี้|Invoice
ใบ|bills
ได้รับชำระเงินเรียบร้อยแล้ว|Payment received
ไฟล์สัญญา (PDF)|Contract file (PDF)
ไฟล์สัญญา|Contract file
ไฟล์ใหญ่เกิน|File exceeds
ไม่กำหนด|No end date
ไม่ต้องติดตั้งแอป|No app to install
ไม่พบบัญชี หรือบัญชีนี้ยังไม่มีเบอร์โทร กรุณาติดต่อผู้ดูแลระบบ|Account not found, or it has no phone number. Please contact the admin
ไม่พบห้อง|No rooms found
ไม่มีข้อมูล|No data
ไม่มีบิลค้างชำระ|No overdue invoices
ไม่มีผู้เช่า|No tenant
ไม่มีห้องที่จ่ายช้า|No late-paying rooms
ไม่มีห้องว่างสำหรับเพิ่มผู้เช่า|No vacant rooms available for a new tenant
ไม่ระบุ|Not specified
ไม่ว่าง (มีผู้เช่า)|Unavailable (occupied)
ไม่ว่าง/ปิดปรับปรุง กรุณาเปลี่ยนสถานะห้องเป็นว่างก่อน|Room is unavailable/under renovation. Please set it to vacant first
ไม่ว่าง|Unavailable
ไม่สำเร็จ|Unsuccessful
ไม่เกิน|Not over
มืด|Dark
ภาษา|Language
โหมดสี|Color mode
โหมดกลางวัน|Daytime mode
โหมดกลางคืน|Night mode
ตั้งค่าส่วนตัว|Personal settings
ตัว|chars
บัญชี|Account`.split('\n').map(l => l.split('|')).filter(x => x.length == 2 && x[0]).sort((a, b) => b[0].length - a[0].length),
            THR = /[\u0E00-\u0E7F]/,
            tl = t => {
                if (!THR.test(t)) return t;
                for (const [a, b] of ENm)
                    if (t.includes(a)) t = t.split(a).join(b);
                return t.replace(/(\d+) Room\b/g, '$1 rooms').replace(/\b1 (bills|persons|times|days|items|invoices|units|rooms)\b/g, (m, a) => '1 ' + a.slice(0, -1))
            },
            tlN = n => {
                if (LANG != 'en') return;
                if (n.nodeType == 3) {
                    const v = tl(n.nodeValue);
                    if (v !== n.nodeValue) n.nodeValue = v
                } else if (n.nodeType == 1 && n.tagName != 'SCRIPT' && n.tagName != 'STYLE') {
                    ['placeholder', 'title', 'alt'].forEach(a => {
                        if (n.hasAttribute(a)) {
                            const o = n.getAttribute(a),
                                v = tl(o);
                            if (v !== o) n.setAttribute(a, v)
                        }
                    });
                    n.childNodes.forEach(tlN)
                }
            };
        new MutationObserver(l => {
            if (LANG != 'en') return;
            l.forEach(m => m.type == 'characterData' ? tlN(m.target) : m.addedNodes.forEach(tlN))
        }).observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
        const applyPf = u => {
            const p = (u && u.pf) || PF;
            LANG = p.lang || 'th';
            document.documentElement.dataset.theme = THEME;
            document.documentElement.lang = LANG
        };

        function setPf(k, v) {
            if (k == 'theme') {
                THEME = v;
                document.documentElement.dataset.theme = v;
                cm();
                R();
                return
            }
            U.pf = Object.assign({}, U.pf || PF, {
                [k]: v
            });
            PF = U.pf;
            try {
                localStorage.setItem('ttm_pf', JSON.stringify(PF))
            } catch (x) {}
            save();
            applyPf(U);
            cm();
            R()
        }
        // ================= ตั้งค่าการเชื่อมต่อ Supabase =================
        // ใส่ Project URL และ anon public key (Dashboard > Project Settings > API) ถ้าเว้นว่างไว้ เว็บจะทำงานแบบเก็บข้อมูลในเบราว์เซอร์ (โหมดทดลอง)
        // หรือกำหนดค่า window.TTM_SB = {url:'https://xxxx.supabase.co', key:'eyJ...'} ในแท็กสคริปต์ก่อนหน้าไฟล์นี้
        const SB_CFG = window.TTM_SB || {
                url: 'https://hpliogcnsxtnrvuyykzd.supabase.co',
                key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwbGlvZ2Nuc3h0bnJ2dXl5a3pkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2ODEyMTMsImV4cCI6MjEwNzI1NzIxM30.DZSHUiux5-7ZOFAd26rKql7boEC7W7OqVhnmlekXPwo'
            },
            SBON = !!(SB_CFG.url && SB_CFG.key);
        const K = 'ttm2',
            $ = s => document.querySelector(s),
            ROOMS = [];
        for (let f = 1; f <= 3; f++)
            for (let i = 1; i <= 9; i++) ROOMS.push(f * 100 + i);
        const seed = () => ({
            set: {
                rent: 3600,
                rate: 8,
                dep: 7600,
                due: 5,
                max: 250,
                pp: '0812345678'
            },
            rooms: ROOMS.map((n, i) => ({
                n,
                m: 1000 + i * 37
            })),
            users: [{
                    id: 1,
                    name: 'ผู้ดูแลระบบ',
                    email: 'admin@ttmansion.local',
                    pw: 'admin123',
                    role: 'admin'
                },
                ...[
                    [101, 'Nattapol Sriwong', 'nattapol'],
                    [102, 'Pimchanok Saelim', 'pimchanok'],
                    [201, 'Kittisak Chaiya', 'kittisak'],
                    [202, 'Waranya Khamla', 'waranya'],
                    [301, 'Somchai Boonmee', 'somchai']
                ]
                .map((x, i) => ({
                    id: i + 2,
                    name: x[1],
                    email: x[2] + '@ttmansion.local',
                    pw: '1234',
                    role: 'tenant',
                    room: x[0]
                }))
            ],
            inv: [],
            log: []
        });
        let D;
        if (SBON) {
            D = seed();
            Object.assign(D, {
                users: [],
                log: [],
                inv: [],
                mail: [],
                tk: [],
                news: [],
                contacts: []
            })
        } else {
            try {
                D = JSON.parse(localStorage.getItem(K))
            } catch (x) {}
            if (!D) D = seed()
        }
        D.inv.forEach(i => {
            if (!i.uid) {
                const u = D.users.find(x => x.room == i.room && x.role == 'tenant');
                if (u) i.uid = u.id
            }
        });
        if (!SBON && !D.users.some(u => u.role == 'owner')) D.users.push({
            id: 99,
            name: 'เจ้าของหอพัก',
            email: 'owner@ttmansion.local',
            pw: 'owner123',
            role: 'owner'
        });
        D.users.forEach(u => {
            if (u.role == 'tenant' && !u.cs) u.cs = u.id > 1e12 ? u.id : Date.now()
        });
        D.tk = D.tk || [];
        D.news = D.news || [];
        const save = () => {
            if (SBON) return sbSync();
            try {
                localStorage.setItem(K, JSON.stringify(D))
            } catch (x) {
                alert('พื้นที่จัดเก็บเต็ม')
            }
        };
        const e = s => String(s || '').replace(/[&<>"']/g, c => '&#' + c.charCodeAt(0) + ';'),
            fm = n => Number(n).toLocaleString(LOCF()),
            sd = d => { const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d).split('-').map(Number); return new Date(p[0], p[1] - 1, p[2]) },
            due = i => {
                const [y, m] = i.per.split('-').map(Number);
                return new Date(y, m, D.set.due)
            },
            late = (i, d = new Date()) => Math.round((sd(d) - due(i)) / 864e5),
            fine = (i, d) => {
                const n = late(i, d);
                return n > 0 ? Math.min(D.set.max, n * (D.set.fpd || 50)) : 0
            },
            st = i => i.s == 'unpaid' && late(i) > 5 ? 'over' : i.s,
            SL = {
                unpaid: ['ยังไม่ชำระ', 'r'],
                pending: ['รอตรวจสอบ', 'y'],
                paid: ['ชำระแล้ว', 'g'],
                over: ['ผิดนัดชำระ', 'p']
            },
            pill = i => `<span class="pl ${SL[st(i)][1]}">${SL[st(i)][0]}</span>`,
            base = i => i.rent + i.el + (i.x || 0),
            tot = i => base(i) + (i.s == 'unpaid' ? fine(i) : i.fine || 0),
            vac = r => !tn(r.n) && !r.st,
            act = r => D.users.find(u => u.room == r && u.role == 'tenant' && !u.out),
            tn = r => (act(r) || {}).name,
            tu = i => D.users.find(u => u.id == i.uid) || act(i.room),
            mine = i => i.uid ? i.uid == U.id : i.room == U.room,
            dt = d => new Date(d).toLocaleDateString(LOCF(), {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }),
            mon = p => {
                const [y, m] = p.split('-');
                return new Date(y, m - 1).toLocaleDateString(LOCF(), {
                    month: 'long',
                    year: 'numeric'
                })
            },
            gi = id => D.inv.find(i => i.id == id),
            lg = a => {
                D.log.unshift({
                    t: Date.now(),
                    by: U.name,
                    a
                });
                D.log = D.log.slice(0, 50);
                if (SBON) sbAudit(a)
            },
            pad = n => String(n).padStart(2, '0');
        // ---- PromptPay (EMVCo) ----
        const tlv = (t, v) => t + pad(v.length) + v;

        function crc(s) {
            let c = 0xFFFF;
            for (let i = 0; i < s.length; i++) {
                c ^= s.charCodeAt(i) << 8;
                for (let j = 0; j < 8; j++) c = (c & 0x8000) ? ((c << 1) ^ 0x1021) & 0xFFFF : (c << 1) & 0xFFFF
            }
            return c.toString(16).toUpperCase().padStart(4, '0')
        }

        function ppay(id, amt) {
            id = id.replace(/\D/g, '');
            const t = id.length == 13 ? tlv('02', id) : tlv('01', '0066' + id.slice(1));
            const d = tlv('00', '01') + tlv('01', '12') + tlv('29', tlv('00', 'A000000677010111') + t) + tlv('53', '764') + tlv('54', amt.toFixed(2)) + tlv('58', 'TH') + '6304';
            return d + crc(d)
        }
        // ---- state ----
        let U = null,
            P = 'home',
            F = 'all',
            Q = '',
            SLIP = null;
        const APP_V = 'v2026.10.16-A',
            RL = {admin: 'ผู้ดูแลระบบ', owner: 'เจ้าของกิจการ', tenant: 'ผู้เช่า'},
            bk = () => {
                try {
                    const o = {};
                    new Intl.DateTimeFormat('en-US', {timeZone: 'Asia/Bangkok', hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'}).formatToParts(new Date()).forEach(p => o[p.type] = +p.value);
                    return new Date(o.year, o.month - 1, o.day, o.hour % 24, o.minute, o.second)
                } catch (x) {
                    return new Date(Date.now() + (new Date().getTimezoneOffset() + 420) * 6e4)
                }
            },
            padd = (p, k) => {
                const [y, m] = p.split('-').map(Number), d = new Date(y, m - 1 + k, 1);
                return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0')
            },
            pcur = () => {
                const n = bk();
                return n.getFullYear() + '-' + String(n.getMonth() + 1).padStart(2, '0')
            },
            // รอบบิลล็อกเมื่อถึงวันที่ 11 ของเดือนถัดไป (เวลาไทย) = เกินวันที่ 10 แล้ว
            plock = p => {
                const [y, m] = p.split('-').map(Number);
                return bk() >= new Date(y, m, 11)
            },
            MAILOK = m => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(m || '').trim()),
            MAILMSG = 'ใช้ได้เฉพาะอีเมล Gmail (@gmail.com) และอีเมลมหาวิทยาลัย (@psru.ac.th) เท่านั้น';
        const dper = () => {
            const n = bk(),
                d = n.getDate() >= 27 ? n : new Date(n.getFullYear(), n.getMonth() - 1, 1);
            return d.getFullYear() + '-' + pad(d.getMonth() + 1)
        };
        let PER = dper();
        try {
            const s = +localStorage.getItem('ttm_s');
            U = D.users.find(u => u.id == s && !u.out) || null;
            if (U) P = 'x'
        } catch (x) {}
        const tt = m => {
            const d = document.createElement('div');
            d.className = 'ts';
            d.textContent = m;
            document.body.appendChild(d);
            setTimeout(() => d.remove(), 3000)
        };
        const av = (u, z = 36) => `<span class="av" style="width:${z}px;height:${z}px;font-size:${z*.42}px">${u.av?`<img src="${u.av}" alt="">`:e((u.name||'?').trim().charAt(0).toUpperCase())}</span>`;
function dg(m,cb){const d=$('#dg');d.innerHTML=`<div class="cd"><p style="white-space:pre-line;margin:0 0 16px">${e(m)}</p><div style="display:flex;gap:10px;justify-content:flex-end">${cb?'<button class="b b2" id="dn">ยกเลิก</button>':''}<button class="b" id="dy">${cb?'ยืนยัน':'ตกลง'}</button></div></div>`;d.style.display='flex';$('#dy').onclick=()=>{d.style.display='none';cb&&cb()};if(cb)$('#dn').onclick=()=>{d.style.display='none'}}
window.alert=m=>dg(String(m));const cf=(m,cb)=>dg(m,cb);
const go=p=>{P=p;R()},mo=h=>{$('#mc').style.maxWidth='';$('#mc').innerHTML=h;$('#mo').style.display='flex'},cm=()=>{$('#mo').style.display='none'};
// ---- public pages ----
const bgL=c=>`<div class="bgL"><div class="orb px" style="--k:40;left:-8%;top:-10%;width:520px;height:520px"><i style="background:radial-gradient(circle,#0e7490cc,transparent 65%)"></i></div><div class="orb px" style="--k:-30;right:-10%;top:20%;width:620px;height:620px"><i style="background:radial-gradient(circle,#3730a3cc,transparent 65%);animation-delay:-4s"></i></div><div class="orb px" style="--k:20;left:30%;bottom:-20%;width:480px;height:480px"><i style="background:radial-gradient(circle,#0891b266,transparent 65%);animation-delay:-8s"></i></div><div class="g3"></div>${c?'<canvas id="pc"></canvas>':''}</div>`;
const kp=()=>{const N=D.rooms.length,occ=D.rooms.filter(r=>tn(r.n)).length,cur=dper(),I=D.inv;return{N,op:Math.round(occ/N*100),ic:I.filter(i=>i.s=='paid'&&i.per==cur).reduce((t,i)=>t+tot(i),0),un:I.filter(i=>st(i)=='unpaid').length,ov:I.filter(i=>st(i)=='over').length}};
const scr=id=>{const x=document.getElementById(id);x&&x.scrollIntoView({behavior:'smooth'})};
const home0=()=>{const K=kp(),nm=e(D.set.name||'T&T Mansion'),AD=D.users.find(u=>u.role=='admin')||{name:'ผู้ดูแลระบบ'},OC=D.rooms.filter(r=>tn(r.n)).length;return`<div class="hp"><header class="hn np"><div class="hw hnr"><div class="logo"><img class="lgi" src="${LG}" alt=""><div>T&T MANSION<br><small class="ac">PAYMENT SYSTEM</small></div></div><nav class="hl"><a class="on" onclick="scrollTo({top:0,behavior:'smooth'})">หน้าแรก</a><a onclick="scr('hf')">ฟีเจอร์</a><a onclick="scr('hst')">ขั้นตอนชำระเงิน</a></nav><div class="hr"><button class="hb" onclick="go('login')">เข้าสู่ระบบ</button></div></div></header>
<section class="hw hh"><h1>ยินดีต้อนรับสู่<br><em>ระบบชำระค่าบริการของหอพัก</em><br>แบบออนไลน์เรียลไทม์</h1>
<div class="hc"><button class="b" onclick="go('login')">เริ่มใช้งาน →</button></div>
<div class="hck"><span>ไม่ต้องติดตั้งแอป</span><span>ใช้ได้ทั้งมือถือและคอมพิวเตอร์</span><span>ยอด QR ขึ้นอัตโนมัติ</span></div>
<small class="mu">รองรับผู้ใช้งาน 3 กลุ่ม</small><div class="hch"><span>🏠 เจ้าของหอพัก</span><span>🛠 ผู้ดูแลระบบ</span><span>${PI} ผู้เช่า</span></div>
<div class="pvw"><div class="pv"><div class="pvb"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i></div><div class="pvx"><div class="pvd"><div class="app"><div class="sb np"><div class="logo" style="margin-bottom:14px"><img class="lgi" src="${LG}" alt=""><div>T&T MANSION<br><small class="ac">PAYMENT SYSTEM</small></div></div>${NVA.map(n=>`<div class="nv ${n[0]=='dash'?'on':''}"><i>${n[2]}</i><span>${n[1]}</span></div>`).join('')}</div><div class="mn"><div class="top np"><input placeholder="ค้นหาห้อง ผู้เช่า หรือเลขที่บิล (กด Enter)"><span class="me">${av(AD,36)}<b>${e(AD.name)}</b></span><span class="seg"><span class="${LANG=='th'?'on':''}">TH</span><span class="${LANG=='en'?'on':''}">EN</span></span><button class="b b2 sm">ออกจากระบบ</button></div>${pg.dash()}</div></div></div></div><span class="pvf">● แดชบอร์ดผู้ดูแลระบบ</span></div>
<div class="ph"><div class="pnt"></div><div class="phs"><div class="phtop"><span class="me">${av(AD,26)}<b>${e(AD.name)}</b></span><span class="seg"><span class="${LANG=='th'?'on':''}">TH</span><span class="${LANG=='en'?'on':''}">EN</span></span></div><b class="pht">ภาพรวมการจัดการ</b><div class="po"><div class="phr">${BLD(30)}<div><b>${nm}</b><small>หอพัก · พิษณุโลก</small></div></div><small>${OC}/${K.N} ห้อง</small><b>${K.op}%</b><div class="pb"><i style="width:${K.op}%"></i></div></div><div class="pt2"><div><small>ห้องทั้งหมด</small><b>${K.N}</b></div><div><small>รายได้เดือนนี้</small><b>฿${fm(K.ic)}</b></div><div><small>ยังไม่ชำระ</small><b>${K.un}</b></div><div><small>ผิดนัดชำระ</small><b>${K.ov}</b></div></div></div><div class="pnb">${NVA.map(n=>`<span class="${n[0]=='dash'?'on':''}"><i>${n[2]}</i>${n[1]}</span>`).join('')}</div></div></div></section>
<section class="hdk"><div class="hw hs3">${[['⌂',D.rooms.length,'ห้องพักที่จัดการในระบบ'],[PI,'3','กลุ่มผู้ใช้งาน เจ้าของ · ผู้ดูแล · ผู้เช่า'],['฿','฿'+D.set.rate,'ค่าไฟต่อหน่วย คำนวณอัตโนมัติ']].map(x=>`<div><i>${x[0]}</i><b>${x[1]}</b><small>${x[2]}</small></div>`).join('')}</div><p class="hdn">ตัวเลขอ้างอิงจากการตั้งค่าของหอพัก T&T แมนชั่น</p></section><div class="hcr">
<section class="hw hx" id="hf"><h2>ครบทุกขั้นตอนการเก็บค่าหอพัก</h2><div class="fx">${[['⌂','ห้องพัก','จัดการห้อง สถานะ และผู้เช่า'],['▥','สัญญาเช่า','บันทึกสัญญาและเงินแรกเข้า'],['◔','มิเตอร์ไฟฟ้า','จดเลขมิเตอร์ คำนวณหน่วยไฟอัตโนมัติ'],['▤','ใบแจ้งหนี้','ออกบิลทุกห้อง พร้อมค่าปรับอัตโนมัติ'],['฿','ชำระเงิน','Dynamic PromptPay QR และแนบสลิป'],['☰','รายงาน','สรุปรายได้และสถานะการชำระเงิน']].map(f=>`<div class="fxc"><i>${f[0]}</i><b>${f[1]}</b><small>${f[2]}</small></div>`).join('')}</div></section>
<section class="hw hx" id="hst"><h2>ชำระเงินง่ายใน 4 ขั้นตอน</h2><div class="sp">${['ดูใบแจ้งหนี้ของห้องคุณ','สแกน QR ยอดขึ้นอัตโนมัติ','แนบสลิปโอนเงิน','ผู้ดูแลอนุมัติ รับใบเสร็จ'].map((t,i)=>`<div><b>${i+1}</b><span>${t}</span></div>`).join('')}</div><div class="hc" style="margin-top:34px"><button class="b" onclick="go('login')">เริ่มใช้งาน</button></div></section>
</div><footer class="lf">© 2026 T&T Mansion Payment System · ${APP_V}</footer></div>`};
const home=()=>{if(PUBD){try{return withPub(home0)}catch(x){console.error(x);PUBD=null}}return home0()};
let LP=0;
function lp(){cancelAnimationFrame(LP);const el=$('#lp'),cv=$('#pc');if(!el||!cv)return;const x=cv.getContext('2d'),N=innerWidth<700?28:60;let W,H;const ps=[];
 const sz=()=>{W=cv.width=innerWidth;H=cv.height=innerHeight};sz();window.onresize=sz;
 for(let i=0;i<N;i++)ps.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.8+.4,v:Math.random()*.35+.08,a:Math.random()*.6+.2});
 el.onpointermove=e=>{el.style.setProperty('--mx',(e.clientX/innerWidth*2-1).toFixed(3));el.style.setProperty('--my',(e.clientY/innerHeight*2-1).toFixed(3))};
 (function f(){if(!$('#pc'))return;x.clearRect(0,0,W,H);x.shadowColor='#ef4444';x.shadowBlur=8;for(const p of ps){p.y-=p.v;p.x+=Math.sin(p.y/60)*.15;if(p.y<-5){p.y=H+5;p.x=Math.random()*W}x.beginPath();x.arc(p.x,p.y,p.r,0,7);x.fillStyle='rgba(239,68,68,'+p.a+')';x.fill()}LP=requestAnimationFrame(f)})()}
const fld=(id,l,ic,t='text',x='')=>`<label>${l}</label><div class="fi"><i>${ic}</i><input id="${id}" type="${t}" ${t=='password'?'style="padding-right:64px"':''} ${x}>${t=='password'?`<u onclick="tg('${id}',this)">แสดง</u>`:''}</div>`;
const tg=(id,b)=>{const el=$('#'+id);el.type=el.type=='password'?'text':'password';b.textContent=el.type=='password'?'แสดง':'ซ่อน'},fl=(m,p)=>{$('#em').value=m;$('#pw').value=p};
const auth=(t,s,h,l,lk,lq)=>`${bgL(0)}<div class="wrap au"><div class="al"><div class="rings px" style="--k:14"><i class="r1"><b></b></i><i class="r2"><b></b></i></div><div class="logo"><img class="lgi" src="${LG}" alt=""> T&T MANSION</div><h1 class="gt">${t}</h1><p class="mu">${s}</p></div><div class="cd gc">${P=='forgot'?'':'<div class="tabs"><span class="'+(P=='login'?'on':'')+'" onclick="go(\'login\')">เข้าสู่ระบบ</span></div>'}${h}<p style="text-align:center;margin:18px 0 0" class="mu">${l} <b class="ac" style="cursor:pointer" onclick="go('${lq}')">${lk}</b></p></div></div>`;
const login=()=>auth('ยินดีต้อนรับกลับ','เข้าสู่ระบบเพื่อตรวจสอบบิลและสถานะการชำระเงินของห้องพัก',`<div class="ah"><span class="ib">🔒</span><div><h2>เข้าสู่ระบบ</h2><small class="mu">สำหรับผู้เช่าและผู้ดูแล</small></div><b class="ac bk" onclick="go('home')">‹ หน้าหลัก</b></div>${fld('em','อีเมล','✉','email',`autocomplete="username" placeholder="name@example.com"`)}${fld('pw','รหัสผ่าน','🔑','password',`autocomplete="current-password" placeholder="••••••••" onkeydown="if(event.key=='Enter')dl()"`)}<div style="text-align:right;margin:-6px 0 12px"><span class="ac" style="cursor:pointer;font-size:13px" onclick="go('forgot')">ลืมรหัสผ่าน?</span></div><button class="b go" style="width:100%" onclick="dl()">เข้าสู่ระบบ →</button><div class="dm"><small class="mu">ทดลองใช้งาน</small><span><button class="b b2 sm" onclick="fl('admin@ttmansion.local','admin123')">ผู้ดูแล</button> <button class="b b2 sm" onclick="fl('owner@ttmansion.local','owner123')">เจ้าของ</button> <button class="b b2 sm" onclick="fl('nattapol@ttmansion.local','1234')">ผู้เช่า</button></span></div>`,'ยังไม่มีบัญชี? ติดต่อผู้ดูแลหอพักเพื่อขอสร้างบัญชี','','login');
const reg=()=>auth('เริ่มต้นบัญชีผู้เช่า','ลงทะเบียนแล้วผู้ดูแลจะเป็นผู้จัดห้องพักให้ภายหลัง',`<div class="ah"><span class="ib">✨</span><div><h2>ลงทะเบียนใหม่</h2><small class="mu">ข้อมูลฉบับนี้บันทึกไว้ในเครื่องนี้</small></div><b class="ac bk" onclick="go('home')">‹ หน้าหลัก</b></div>${fld('rn','ชื่อ - นามสกุล',PI)}<label>เพศ</label><div class="fi"><i>⚥</i><select id="rg"><option value="">เลือกเพศ</option><option>ชาย</option><option>หญิง</option><option>อื่นๆ</option></select></div>${fld('rt','เบอร์โทร','☎','tel','placeholder="08x-xxx-xxxx" autocomplete="tel"')}${fld('em','อีเมล','✉','email')}${fld('pw','รหัสผ่าน (อย่างน้อย 6 ตัว)','🔑','password')}<button class="b go" style="width:100%" onclick="dr()">สร้างบัญชีและเข้าสู่ระบบ →</button>`,'มีบัญชีแล้ว?','เข้าสู่ระบบ','login');
function dl(){const u=D.users.find(u=>u.email==$('#em').value.trim().toLowerCase()&&u.pw==$('#pw').value);if(!u)return alert('อีเมลหรือรหัสผ่านไม่ถูกต้อง');if(u.out)return alert('บัญชีนี้ย้ายออกแล้ว กรุณาติดต่อผู้ดูแล');enter(u,0,1)}
function enter(u,pg2,how){U=u;applyPf(u);P=pg2||'x';try{localStorage.setItem('ttm_s',u.id)}catch(x){}R();if(how)tt('✓ เข้าสู่ระบบสำเร็จ · '+(RL[u.role]||'')+' '+u.name)}
function genPw(){const c='abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';let s='';const a=new Uint32Array(8);crypto.getRandomValues(a);for(const v of a)s+=c[v%c.length];return s}
function dr(){const n=$('#rn').value.trim(),g=$('#rg').value,t=$('#rt').value.replace(/[\s-]/g,''),m=$('#em').value.trim().toLowerCase(),p=$('#pw').value;
 if(!n||!g||!t||!m||p.length<6)return alert('กรอกข้อมูลให้ครบ (ชื่อ เพศ เบอร์โทร อีเมล และรหัสผ่านอย่างน้อย 6 ตัว)');
 if(!/^\S+@\S+$/.test(m))return alert('รูปแบบอีเมลไม่ถูกต้อง');if(!MAILOK(m))return alert(MAILMSG);if(!/^0\d{8,9}$/.test(t))return alert('เบอร์โทรไม่ถูกต้อง (เช่น 0812345678)');
 if(D.users.some(u=>u.email==m))return alert('อีเมลนี้ถูกใช้แล้ว');
 const u={id:Date.now(),name:n,email:m,pw:p,role:'tenant',room:null,g,tel:t,cs:Date.now()};D.users.push(u);save();enter(u,'prof');tt('✓ ลงทะเบียนสำเร็จ · ผู้เช่า '+u.name+' · รอผู้ดูแลจัดห้องพักให้')}
const forgot=()=>SBON?forgotSB():auth('ลืมรหัสผ่าน','ยืนยันตัวตนด้วยอีเมลและเบอร์โทรที่ลงทะเบียนไว้ แล้วตั้งรหัสผ่านใหม่',`<div class="ah"><span class="ib">🔑</span><div><h2>ตั้งรหัสผ่านใหม่</h2><small class="mu">ใช้ได้เมื่อบัญชีมีเบอร์โทร</small></div><b class="ac bk" onclick="go('login')">‹ กลับ</b></div>${fld('em','อีเมล','✉','email')}${fld('rt','เบอร์โทรที่ลงทะเบียน','☎','tel')}${fld('pw','รหัสผ่านใหม่ (อย่างน้อย 6 ตัว)','🔑','password')}${fld('pw2','ยืนยันรหัสผ่านใหม่','🔑','password')}<button class="b go" style="width:100%" onclick="fp()">ตั้งรหัสผ่านใหม่ →</button><div class="note">หากบัญชียังไม่มีเบอร์โทร (เช่น ผู้ดูแลระบบ) ให้ติดต่อผู้ดูแลเพื่อรีเซ็ตรหัสผ่านให้</div>`,'จำรหัสผ่านได้แล้ว?','เข้าสู่ระบบ','login');
function fp(){const m=$('#em').value.trim().toLowerCase(),t=$('#rt').value.replace(/\D/g,''),w=$('#pw').value,u=D.users.find(x=>x.email==m);
 if(!m||!t||!w)return alert('กรอกข้อมูลให้ครบ');if(!u||!u.tel)return alert('ไม่พบบัญชี หรือบัญชีนี้ยังไม่มีเบอร์โทร กรุณาติดต่อผู้ดูแลระบบ');
 if(u.tel.replace(/\D/g,'')!=t)return alert('เบอร์โทรไม่ตรงกับที่ลงทะเบียนไว้');if(u.out)return alert('บัญชีนี้ย้ายออกแล้ว กรุณาติดต่อผู้ดูแล');
 if(w.length<6)return alert('รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัว');if(w!=$('#pw2').value)return alert('ยืนยันรหัสผ่านไม่ตรงกัน');
 u.pw=w;save();go('login');tt('✓ ตั้งรหัสผ่านใหม่สำเร็จ กรุณาเข้าสู่ระบบ')}
function lof(r,err){ // ตัวกันเหนียว: ถ้าวาดหน้าต้อนรับไม่สำเร็จ ให้ล้างเซสชันแล้วโหลดหน้าแรกใหม่
 try{Object.keys(localStorage).filter(k=>/^sb-.*-auth-token/.test(k)||k=='ttm_s').forEach(k=>localStorage.removeItem(k))}catch(x){}
 try{sessionStorage.setItem('ttm_lo',r||'1')}catch(x){}
 try{console.error('logout render failed:',err)}catch(x){}
 location.replace(location.pathname+location.search)}
function lok(){return !document.querySelector('#app > .app')}
function lout(r){let bad=null;try{R()}catch(x){bad=x;PUBD=null;try{R();bad=null}catch(y){bad=y}}
 if(bad||!lok())return lof(r,bad);
 try{tt('✓ ออกจากระบบสำเร็จ'+(r?' · '+RL[r]:''))}catch(x){}
 setTimeout(()=>{if(!U&&!lok())lof(r,'late re-render')},1500)}
function out(){const r=U&&U.role;U=null;P='home';try{localStorage.removeItem('ttm_s')}catch(x){}lout(r)}
// ---- admin pages ----
const FL=[['all','ทั้งหมด'],['paid','ชำระแล้ว'],['pending','รอตรวจสอบ'],['unpaid','ยังไม่ชำระ'],['over','ผิดนัดชำระ']];
const flt=()=>`<div class="fl">${FL.map(f=>`<button class="b ${F==f[0]?'':'b2'}" onclick="F='${f[0]}';R()">${f[1]}</button>`).join('')}</div>`;
function tbl(){const q=Q.toLowerCase(),l=D.inv.filter(i=>(F=='all'||st(i)==F)&&(!q||(i.id+i.room+((tu(i)||{}).name||'')).toLowerCase().includes(q))).sort((a,b)=>b.per.localeCompare(a.per)||a.room-b.room);
 return`<div class="sc"><table><tr><th>เลขที่</th><th>ห้อง</th><th>ผู้เช่า</th><th>รอบบิล</th><th>ยอดสุทธิ</th><th>ครบกำหนด</th><th>วิธีชำระ</th><th>สถานะ</th><th></th></tr>${l.map(i=>{const s=st(i);return`<tr><td>${i.id}</td><td>${i.room}</td><td>${e((tu(i)||{}).name)}</td><td>${mon(i.per)}</td><td>฿${fm(tot(i))}</td><td>${dt(due(i))}</td><td>${i.mt=='qr'?'QR':i.mt=='cash'?'เงินสด':'-'}</td><td>${pill(i)}</td><td>${s=='pending'?`${i.slip?`<button class="b b2 sm" onclick="vs('${i.id}')">สลิป</button> `:''}<button class="b sm" onclick="ap('${i.id}',1)">อนุมัติ</button> <button class="b b2 sm" onclick="ap('${i.id}',0)">ปฏิเสธ</button>`:s=='paid'?`<button class="b b2 sm" onclick="rc('${i.id}')">ใบเสร็จ</button>`:`<button class="b b2 sm" onclick="vi('${i.id}')">ใบแจ้งหนี้</button> <button class="b b2 sm" onclick="cs('${i.id}')">รับเงินสด (เคาน์เตอร์)</button>`}</td></tr>`}).join('')||'<tr><td colspan=9 class=mu>ยังไม่มีรายการ</td></tr>'}</table></div>`}
function ap(id,y){const i=gi(id);if(y){i.s='paid';i.paid=Date.now();i.rc=nrc();lg('อนุมัติ '+id);mail('rcp',i);save();R();return}
 mo(`<h3>ปฏิเสธสลิป ${id}</h3><small class="mu">ผู้เช่าจะเห็นเหตุผลนี้ในหน้าใบแจ้งหนี้ แล้วส่งสลิปใหม่ได้</small><label>เหตุผล</label><select id="rj_s"><option value="">— เลือกเหตุผล —</option><option>ยอดเงินไม่ตรงกับใบแจ้งหนี้</option><option>สลิปไม่ชัดเจน อ่านข้อมูลไม่ได้</option><option>สลิปไม่ใช่ของรายการนี้หรือเป็นสลิปซ้ำ</option><option>ไม่พบยอดเงินเข้าบัญชี</option><option>อื่นๆ</option></select><label>รายละเอียดเพิ่มเติม (ไม่บังคับ)</label><input id="rj_t" maxlength="120"><div style="display:flex;gap:8px;margin-top:12px"><button class="b" onclick="apr('${id}')">ยืนยันปฏิเสธ</button><button class="b b2" onclick="cm()">ยกเลิก</button></div>`)}
function apr(id){const i=gi(id),a=$('#rj_s').value,t=$('#rj_t').value.trim();if(!a)return alert('เลือกเหตุผลที่ปฏิเสธ');const rs=a+(t?' · '+t:'');i._rjr=rs;i.rj=rs;i.s='unpaid';i.fine=0;delete i.slip;delete i.mt;lg('ปฏิเสธ '+id+' ('+rs+')');save();cm();R()}
function cs(id){const i=gi(id);cf('ยืนยันรับเงินสดห้อง '+i.room+' ยอด ฿'+fm(tot(i))+'?',()=>{i.fine=fine(i);i.mt='cash';i.sub=Date.now();i.s='paid';i.paid=Date.now();i.rc=nrc();lg('รับเงินสด '+id);save();mail('rcp',i);R()})}
function vs(id){return mo(`<h3>สลิป ${id}</h3><img src="${gi(id).slip}" style="width:100%;border-radius:12px;margin:12px 0"><button class="b b2" onclick="cm()">ปิด</button>`)}
const bar=(l,t,w,c)=>`<div class="bd"><small class="mu">${l}</small><b style="color:${c}">${t}</b></div><div class="pb"><i style="width:${w}%;background:${c}"></i></div>`,
dn=p=>`<svg viewBox="0 0 100 100" style="width:110px;height:110px"><circle cx="50" cy="50" r="40" fill="none" stroke="#fee2e2" stroke-width="10"/><circle cx="50" cy="50" r="40" fill="none" stroke="#dc2626" stroke-width="10" stroke-linecap="${p?'round':'butt'}" stroke-dasharray="${p*2.513} 251.3" transform="rotate(-90 50 50)"/><text x="50" y="56" text-anchor="middle" font-size="20" font-weight="700" fill="#1f2937">${p}%</text></svg>`,
ms=p=>{const[y,m]=p.split('-');return new Date(y,m-1).toLocaleDateString(LOCF(),{month:'short',year:'numeric'})},
lc=(v,l,c,big,nm)=>{const W=600,H=big?200:70,pl=big?70:4,pb=big?26:4,pt=8,mx=Math.max(...v,1),n=v.length,x=i=>pl+(W-pl-10)*(n>1?i/(n-1):.5),y=a=>pt+(H-pt-pb)*(1-a/mx),pts=v.map((a,i)=>x(i)+','+y(a)),id='g'+c.slice(1),area='M'+x(0)+','+(H-pb)+' L'+pts.join(' L')+' L'+x(n-1)+','+(H-pb)+'Z';
 return`${big?`<div class="cw" data-v='${JSON.stringify(v)}' data-l='${JSON.stringify(l)}' data-c="${c}" data-n="${nm}">`:''}<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c}" stop-opacity=".25"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></linearGradient></defs>${big?[0,.5,1].map(t=>`<line x1="${pl}" x2="${W-10}" y1="${y(mx*t)}" y2="${y(mx*t)}" stroke="#f3dcdc"/><text x="${pl-8}" y="${y(mx*t)+4}" text-anchor="end" font-size="11" fill="#9ca3af">฿${fm(Math.round(mx*t))}</text>`).join(''):''}${big?v.map((a,i)=>`<line x1="${x(i)}" x2="${x(i)}" y1="${pt}" y2="${H-pb}" stroke="#f3dcdc" stroke-dasharray="3 4"/>`).join(''):''}<path d="${area}" fill="url(#${id})"/><polyline points="${pts.join(' ')}" fill="none" stroke="${c}" stroke-width="2.5" stroke-linejoin="round"/>${big?v.map((a,i)=>`<circle cx="${x(i)}" cy="${y(a)}" r="4" fill="#fff" stroke="${c}" stroke-width="2"/><text x="${x(i)}" y="${H-6}" text-anchor="${i==n-1&&n>1?'end':'middle'}" font-size="11" fill="#6b7280">${l[i]}</text>`).join(''):''}${big?`<line class="hv" x1="0" x2="0" y1="${pt}" y2="${H-pb}" stroke="${c}" stroke-dasharray="4 4" opacity="0"/><circle class="hd" r="6" fill="${c}" stroke="#fff" stroke-width="2" opacity="0"/>`:''}</svg>${big?'<div class="tp"></div></div>':''}`};
let RQ='',RV=0,TT='in',TQ='',TS='',RP='all';
const PN=()=>e(D.set.name||'T&T Mansion'),
hdr=(ic,t,sub,act)=>`<div class="hd2">${ic=='▦'?BLD(48):`<i class="ci" style="width:44px;height:44px;font-size:20px">${ic}</i>`}<div style="flex:1"><h2>${t}</h2><p class="mu" style="margin:2px 0 6px">${sub}</p><span class="pchip">▦ ${PN()}</span></div>${act||''}</div>`,
dn3=(parts,c)=>{const t=parts.reduce((a,x)=>a+x[0],0)||1;let off=0;return`<svg viewBox="0 0 100 100" style="width:150px;height:150px"><circle cx="50" cy="50" r="40" fill="none" stroke="#fee2e2" stroke-width="14"/>${parts.map(x=>{const l=x[0]/t*251.3,z=`<circle cx="50" cy="50" r="40" fill="none" stroke="${x[1]}" stroke-width="14" stroke-dasharray="${l} 251.3" stroke-dashoffset="${-off}" transform="rotate(-90 50 50)"/>`;off+=l;return z}).join('')}<text x="50" y="55" text-anchor="middle" font-size="11" font-weight="700" fill="#1f2937">฿${fm(c)}</text></svg>`};
function mnu(ev,el){const m=el._m||el.querySelector('.mdd'),o=m.classList.contains('open');el._m=m;document.querySelectorAll('.mdd.open').forEach(x=>x.classList.remove('open'));if(!o){document.body.appendChild(m);const b=el.getBoundingClientRect();m.style.top=Math.min(b.bottom+4,innerHeight-170)+'px';m.style.left=Math.max(8,b.right-165)+'px';m.classList.add('open')}}
document.addEventListener('click',ev=>{if(!ev.target.closest('.mm'))document.querySelectorAll('.mdd.open').forEach(x=>x.classList.remove('open'))});
function at0(){const f=D.rooms.filter(vac);if(!f.length)return alert('ไม่มีห้องว่างสำหรับเพิ่มผู้เช่า');mo(`<h3>เพิ่มผู้เช่า</h3><label>เลือกห้องว่าง</label><select id="a0">${f.map(r=>`<option>${r.n}</option>`).join('')}</select><button class="b" onclick="const n=+$('#a0').value;cm();rm(n)">ต่อไป</button> <button class="b b2" onclick="cm()">ยกเลิก</button>`)}
function repTop(){const cur=dper(),I=D.inv,y=cur.slice(0,4),d3=new Date(+y,+cur.slice(5)-3,1),m3=d3.getFullYear()+'-'+pad(d3.getMonth()+1),
 ok=i=>RP=='all'||(RP=='cur'?i.per==cur:RP=='yr'?i.per.startsWith(y):i.per>=m3),
 P=I.filter(i=>i.s=='paid'&&ok(i)).sort((a,b)=>(b.paid||0)-(a.paid||0)),sm=(a,f)=>a.reduce((t,i)=>t+f(i),0),T=sm(P,tot),rt=sm(P,i=>i.rent),el=sm(P,i=>i.el),ot=T-rt-el,
 A=D.users.filter(u=>u.role=='tenant'&&!u.out&&u.room),am=A.length?A.reduce((t,u)=>t+(Date.now()-(u.cs||u.id))/(30.4*864e5),0)/A.length:0,
 dy=P.filter(i=>i.paid).map(i=>({i,d:Math.round((sd(new Date(i.paid))-due(i))/864e5)})),lt=dy.filter(x=>x.d>0),on=dy.length?Math.round((dy.length-lt.length)/dy.length*100):0,al=lt.length?lt.reduce((t,x)=>t+x.d,0)/lt.length:0,
 bR={};P.forEach(i=>bR[i.room]=(bR[i.room]||0)+tot(i));const tp=Object.entries(bR).sort((a,b)=>b[1]-a[1]).slice(0,5),tx=tp[0]?tp[0][1]:1,
 lr={};lt.forEach(x=>(lr[x.i.room]=lr[x.i.room]||[]).push(x.d));const ls=Object.entries(lr).sort((a,b)=>b[1].length-a[1].length).slice(0,5),
 pc=v=>T?Math.round(v/T*100):0,sel=[['all','ทั้งหมด'],['cur','รอบบิลปัจจุบัน'],['3m','ย้อนหลัง 3 เดือน'],['yr','ปีนี้']];
 return hdr('☰','รายงานรายรับ','สรุปรายรับที่ชำระแล้วในช่วงเวลาที่เลือก พิมพ์เป็น PDF หรือส่งออก CSV')+`<div class="cd" style="display:flex;gap:14px;align-items:flex-end;flex-wrap:wrap"><div><label>ช่วงเวลา</label><select onchange="RP=this.value;R()" style="margin-bottom:0;min-width:200px">${sel.map(x=>`<option value="${x[0]}" ${RP==x[0]?'selected':''}>${x[1]}</option>`).join('')}</select></div><span style="flex:1"></span><button class="b b2 np" onclick="xc()">ส่งออก CSV</button><button class="b np" onclick="document.body.classList.add('pr');print();setTimeout(()=>document.body.classList.remove('pr'),600)">พิมพ์ / PDF</button></div>
<div class="s4c"><div class="cd" style="background:#fff1f1"><small class="mu">รายรับรวม</small><div class="k ac">฿${fm(T)}</div></div><div class="cd"><small class="mu">ใบที่ชำระแล้ว</small><div class="k">${P.length}</div></div><div class="cd"><small class="mu">จำนวนรอบบิล</small><div class="k">${new Set(P.map(i=>i.per)).size}</div></div><div class="cd"><small class="mu">ระยะเช่าเฉลี่ย</small><div class="k">${am.toFixed(1)} <small class="mu">เดือน</small></div></div></div>
<div class="cd"><h3>รายรับตามประเภท</h3><div style="display:flex;gap:24px;align-items:center;flex-wrap:wrap;margin-top:12px"><div>${dn3([[rt,'#dc2626'],[el,'#f59e0b'],[ot,'#9ca3af']],T)}</div><div style="flex:1;min-width:240px">${bar('ค่าเช่า '+pc(rt)+'%','฿'+fm(rt),pc(rt),'#dc2626')}${bar('ค่าไฟ '+pc(el)+'%','฿'+fm(el),pc(el),'#f59e0b')}${bar('อื่นๆ / ค่าปรับ '+pc(ot)+'%','฿'+fm(ot),pc(ot),'#9ca3af')}</div></div></div>
<div class="s4c"><div class="cd"><small class="mu">เฉลี่ยต่อบิล</small><div class="k">฿${fm(P.length?Math.round(T/P.length):0)}</div></div><div class="cd tl2"><small class="mu">จ่ายตรงเวลา</small><div class="k" style="color:#15803d">${on}%</div><small class="mu">ช้าเฉลี่ย ${al.toFixed(1)} วัน</small></div><div class="cd tl3"><small class="mu">หน่วยไฟที่เรียกเก็บ</small><div class="k" style="color:#a16207">${fm(sm(P,i=>i.u))} <small>หน่วย</small></div></div><div class="cd tl4"><small class="mu">ค่าปรับที่เก็บได้</small><div class="k" style="color:#b91c1c">฿${fm(sm(P,i=>i.fine||0))}</div></div></div>
<div class="dg2"><div class="cd"><h3 style="margin-bottom:12px">ห้องรายรับสูงสุด</h3>${tp.map((x,k)=>bar((k+1)+'  ห้อง '+x[0],'฿'+fm(x[1]),Math.round(x[1]/tx*100),'#dc2626')).join('')||'<small class="mu">ยังไม่มีข้อมูล</small>'}</div><div class="cd"><h3 style="margin-bottom:12px">ห้องที่จ่ายช้า</h3>${ls.map(x=>`<div class="bd"><span><b>ห้อง ${x[0]}</b><br><small class="mu">${e(tn(+x[0])||'-')}</small></span><span style="text-align:right"><b style="color:#dc2626">${x[1].length} ครั้ง</b><br><small class="mu">ช้าเฉลี่ย ${(x[1].reduce((a,b)=>a+b,0)/x[1].length).toFixed(0)} วัน</small></span></div>`).join('')||'<small class="mu">ไม่มีห้องที่จ่ายช้า</small>'}</div></div>
<div class="cd sc" style="margin-top:14px"><h3 style="margin-bottom:10px">ใบเรียกเก็บเงินที่ชำระแล้ว</h3><table><tr><th>ชำระเมื่อ</th><th>ห้อง</th><th>ผู้เช่า</th><th>รอบบิล</th><th>จำนวนเงิน</th><th></th></tr>${P.map(i=>`<tr><td>${i.paid?dt(i.paid):'-'}</td><td>ห้อง ${i.room}</td><td>${e((tu(i)||{}).name)}</td><td>${mon(i.per)}</td><td><b>฿${fm(tot(i))}</b></td><td><button class="b b2 sm" onclick="rc('${i.id}')">ใบเสร็จ</button></td></tr>`).join('')||'<tr><td colspan=6 class=mu>ยังไม่มีรายการ</td></tr>'}</table></div>`}
const pg={
dash(){const I=D.inv,N=D.rooms.length,occ=D.rooms.filter(r=>tn(r.n)).length,mt=D.rooms.filter(r=>r.st=='maint'&&!tn(r.n)).length,bz=D.rooms.filter(r=>r.st=='busy'&&!tn(r.n)).length,fr=N-occ-mt-bz,op=Math.round(occ/N*100),
 cur=dper(),[cy,cmo]=cur.split('-').map(Number),pp=(d=>d.getFullYear()+'-'+pad(d.getMonth()+1))(new Date(cy,cmo-2,1)),
 pd=i=>i.s=='paid',sm=(a,f)=>a.reduce((t,i)=>t+f(i),0),inc=q=>sm(I.filter(i=>pd(i)&&i.per==q),tot),
 C=I.filter(i=>i.per==cur),cp=C.filter(pd).length,rate=C.length?Math.round(cp/C.length*100):0,
 un=I.filter(i=>st(i)=='unpaid').length,ov=I.filter(i=>st(i)=='over').length,
 ic=inc(cur),ip=inc(pp),yr=sm(I.filter(i=>pd(i)&&i.per.startsWith(String(cy))),tot),dlt=ip?Math.round((ic-ip)/ip*100):0,
 ps=[5,4,3,2,1,0].map(k=>{const d=new Date(cy,cmo-1-k,1);return d.getFullYear()+'-'+pad(d.getMonth()+1)}),
 age=[0,0,0];I.filter(i=>!pd(i)).forEach(i=>{const n=late(i);age[n>60?2:n>30?1:0]++});
 const am=Math.max(...age,1),pc=I.filter(i=>pd(i)&&i.per==cur),rt=sm(pc,i=>i.rent),el=sm(pc,i=>i.el),ot=ic-rt-el,g={};
 I.filter(pd).forEach(i=>{const n=(tu(i)||{}).name||'-';g[n]=(g[n]||0)+tot(i)});
 const tp=Object.entries(g).sort((a,b)=>b[1]-a[1]).slice(0,5),tm=tp[0]?tp[0][1]:1,rc2=[...I].sort((a,b)=>(b.iss||0)-(a.iss||0)).slice(0,6),nm=e(D.set.name||'T&T Mansion'),
 w=(v,m)=>m?Math.round(v/m*100):0,cs=k=>C.filter(i=>st(i)==k).length;
 return`<h2>ภาพรวมการจัดการ</h2><p class="mu">ภาพรวมการชำระค่าบริการของ ${nm}</p>
<div class="cd" style="margin:18px 0;max-width:520px"><div style="display:flex;gap:12px;align-items:center">${BLD(46)}<div style="flex:1"><b>${nm}</b><br><small class="mu">หอพัก · พิษณุโลก</small></div><span class="pl g">มีผู้เช่า</span></div><div class="bd mu" style="margin-top:12px"><span>${occ}/${N} ห้อง</span><b class="ac">${op}%</b></div><div class="pb"><i style="width:${op}%"></i></div><div class="bd"><b class="ac">฿${fm(D.set.rent)}<small class="mu">/เดือน</small></b><b class="ac" style="cursor:pointer" onclick="go('rooms')">ดูรายละเอียด ›</b></div></div>
<div class="dg3"><div class="cd sq"><div><small class="mu">ห้องทั้งหมด</small><div class="k">${N}</div><small class="mu">${fr} ว่าง</small></div><div><small class="mu">รายได้เดือนนี้</small><div class="k">฿${fm(ic)}</div><small class="mu">${cp} ใบเรียกเก็บชำระแล้ว</small></div><div><small class="mu">ยังไม่ชำระ</small><div class="k">${un}</div><small class="mu">ใบเรียกเก็บที่ออก</small></div><div class="hot"><small class="mu">ผิดนัดชำระ</small><div class="k" style="color:#dc2626">${ov}</div><small style="color:#dc2626">ต้องดำเนินการ</small></div></div>
<div class="cd" style="text-align:center">${dn(op)}<b style="display:block;margin-bottom:10px">อัตราการเข้าพัก</b>${[['มีผู้เช่า',occ,'#dc2626'],['ไม่ว่าง',bz,'#f59e0b'],['ปิดปรับปรุง',mt,'#9ca3af'],['ว่าง',fr,'#e5e7eb']].map(x=>`<div class="bd" style="font-size:13px"><span><i class="dt" style="background:${x[2]}"></i> ${x[0]}</span><b>${x[1]}</b></div>`).join('')}</div>
<div class="cd live"><div class="ch"><b>วิเคราะห์เชิงลึก</b><span class="pl g">LIVE</span></div><div class="mt3"><div><small>เก็บเงิน</small><b>${rate}%</b></div><div><small>ค้างชำระ</small><b>${un+ov} ใบ</b></div><div><small>รายรับเดือนนี้</small><b>฿${fm(ic)}</b></div></div><small class="mu">แนวโน้มรายรับ 6 เดือน</small>${lc(ps.map(inc),0,'#dc2626')}</div></div>
<div class="ch" style="justify-content:flex-start;gap:12px;margin:28px 0 12px"><i class="ci">▥</i><div><h3>วิเคราะห์เชิงลึก</h3><small class="mu">ข้อมูลจากใบเรียกเก็บเงินและห้องพักทั้งหมด</small></div></div>
<div class="dg3b"><div class="cd"><small class="mu">เดือนที่แล้ว</small><div class="k">฿${fm(ip)}</div></div><div class="cd"><small class="mu">รวมทั้งปี</small><div class="k">฿${fm(yr)}</div></div><div class="cd"><small class="mu">เทียบเดือนก่อน</small><div class="k" style="color:${dlt<0?'#dc2626':'#16a34a'}">${dlt>0?'+':''}${dlt}%</div></div></div>
<div class="dg3b"><div class="cd" style="text-align:center"><h3 style="text-align:left;margin-bottom:10px">เก็บเงินเดือนนี้</h3>${dn(rate)}<br><small class="mu">${cp}/${C.length} ใบที่ชำระแล้ว</small></div>
<div class="cd"><h3 style="margin-bottom:12px">อายุหนี้ค้างชำระ</h3>${[['0–30 วัน','#f59e0b'],['31–60 วัน','#ea580c'],['60+ วัน','#b91c1c']].map((x,k)=>bar(x[0],age[k],w(age[k],am),x[1])).join('')}</div>
<div class="cd"><h3 style="margin-bottom:12px">รายได้ตามประเภท</h3>${bar('ค่าเช่า','฿'+fm(rt),w(rt,ic),'#dc2626')}${bar('ค่าไฟ','฿'+fm(el),w(el,ic),'#f59e0b')}${bar('อื่นๆ / ค่าปรับ','฿'+fm(ot),w(ot,ic),'#9ca3af')}</div></div>
<div class="dg2"><div class="cd"><h3 style="margin-bottom:12px">ผู้เช่าที่ชำระสูงสุด</h3>${tp.map((x,k)=>bar((k+1)+'  '+e(x[0]),'฿'+fm(x[1]),w(x[1],tm),'#dc2626')).join('')||'<small class="mu">ยังไม่มีข้อมูล</small>'}</div>
<div class="cd"><h3 style="margin-bottom:12px">รอบบิล ${mon(cur)}</h3><div class="mt3" style="grid-template-columns:1fr 1fr"><div><small>ชำระแล้ว</small><b>${cs('paid')}</b></div><div><small>รอตรวจสอบ</small><b>${cs('pending')}</b></div><div><small>ยังไม่ชำระ</small><b>${cs('unpaid')}</b></div><div><small>ผิดนัดชำระ</small><b>${cs('over')}</b></div></div></div></div>
<div class="dg2"><div class="cd"><h3 style="margin-bottom:8px">รายรับ 6 เดือนล่าสุด</h3>${lc(ps.map(inc),ps.map(ms),'#dc2626',1,'รายรับ')}</div><div class="cd"><h3 style="margin-bottom:8px">รายรับค่าไฟ 6 เดือนล่าสุด</h3>${lc(ps.map(q=>sm(I.filter(i=>pd(i)&&i.per==q),i=>i.el)),ps.map(ms),'#f59e0b',1,'ค่าไฟ')}</div></div>
<div class="ch" style="margin:22px 0 4px"><h3>ใบเรียกเก็บเงินล่าสุด</h3><b class="ac" style="cursor:pointer" onclick="go('pay')">ดูทั้งหมด ›</b></div><div class="ri">${rc2.map(i=>`<div class="cd" onclick="vi('${i.id}')" style="cursor:pointer;display:flex;gap:12px;align-items:center;padding:16px"><span class="dy">${due(i).getDate()}</span><div style="flex:1;line-height:1.7"><b>${mon(i.per)}</b> <span class="rch">ห้อง ${i.room}</span><br><small class="mu">${e((tu(i)||{}).name)}</small><br>${pill(i)}</div><b>฿${fm(tot(i))}</b></div>`).join('')||'<div class="cd mu">ยังไม่มีใบเรียกเก็บเงิน</div>'}</div>
<div class="row" style="flex-wrap:wrap;margin-top:14px"><div class="cd" style="flex:2;min-width:300px"><div style="display:flex;justify-content:space-between"><div><h3>สถานะห้องพัก</h3><small class="mu">คลิกห้องเพื่อแก้ไขข้อมูล</small></div><b class="ac" style="cursor:pointer" onclick="go('rooms')">ดูทั้งหมด ›</b></div><br>${rg()}</div>
<div class="cd" style="flex:1;min-width:240px"><h3>การดำเนินการด่วน</h3><br><div class="cd nv" style="margin-bottom:10px" onclick="go('met')">บันทึกเลขมิเตอร์</div><div class="cd nv" style="margin-bottom:10px" onclick="go('met')">ออกใบแจ้งหนี้</div><div class="cd nv" onclick="F='pending';go('pay')">ตรวจสอบสลิป</div></div></div>
<div class="cd" style="margin-top:14px"><h3>ใบแจ้งหนี้ประจำเดือน</h3><small class="mu">ค่าเช่า ฿${fm(D.set.rent)} + ค่าไฟ ฿${D.set.rate}/หน่วย</small>${flt()}${tbl()}</div>`},
rooms(){const S=D.set,q=RQ.trim().toLowerCase(),ro=U.role=='owner',N=D.rooms.length,fr=D.rooms.filter(vac).length,
 card=r=>{const t=act(r.n),s=t?['มีผู้เช่า','g']:r.st=='busy'?['ไม่ว่าง','p']:r.st=='maint'?['ปิดปรับปรุง','r']:['ว่าง','y'];
 return`<div class="rc2"><div class="rh2"><i class="ci">⌂</i><div style="flex:1"><b>ห้อง ${r.n}</b> <span class="pl ${s[1]}">${s[0]}</span><br><small class="mu">ห้องปรับอากาศ</small></div></div><div class="bd"><small class="mu">ค่าเช่าต่อเดือน</small><b>฿${fm(S.rent)}</b></div><div class="bd"><small class="mu">เลขมิเตอร์ล่าสุด</small><b>${r.m}</b></div><div class="bd"><small class="mu">ผู้เช่าปัจจุบัน</small><span class="tn2">${t?av(t,22)+e(t.name):'-'}</span></div><button class="b b2 rmb" onclick="rm(${r.n})">จัดการห้อง →</button></div>`},
 fls=[1,2,3].map(f=>{const rs=D.rooms.filter(r=>Math.floor(r.n/100)==f&&(!RV||vac(r))&&(!q||String(r.n).includes(q)||(tn(r.n)||'').toLowerCase().includes(q)));return rs.length?`<div class="fh" style="margin-top:18px"><b>ชั้น ${f}</b><span class="pl g">${rs.length} ห้อง</span></div><div class="rgc">${rs.map(card).join('')}</div>`:''}).join('');
 return hdr('▦',PN(),`${S.addr?e(S.addr)+' · ':''}฿${fm(S.rent)} / เดือน`)+`<div class="dg2"><div class="cd"><div class="ch"><div class="fh"><i class="ci">⚙</i><div><b>ตั้งค่าทรัพย์สิน</b><br><small class="mu">กฎการเรียกเก็บค่าบริการของหอพัก</small></div></div><span class="pl g ${ro?'':'ptr'}" ${ro?'':`onclick="go('set')"`}>ตั้งค่าแล้ว ✓</span></div><div class="tb2" style="margin-top:12px"><span class="tg">❄ แอร์ทุกห้อง</span><span class="tg">💧 ค่าน้ำฟรี</span><span class="tg">⚡ ฿${S.rate}/หน่วย</span><span class="tg">📅 ครบกำหนดวันที่ ${S.due}</span><span class="tg">🪙 ค่าปรับสูงสุด ฿${S.max}</span></div></div>
<div class="cd"><div class="ch"><div class="fh"><i class="ci">฿</i><div><b>ข้อมูลการชำระเงิน</b><br><small class="mu">พร้อมเพย์สำหรับใบเรียกเก็บเงิน</small></div></div><span class="pl g">ตั้งค่าแล้ว ✓</span></div><p class="mu" style="margin:12px 0 0;font-size:13px">PromptPay: <b>${e(S.pp||'-')}</b>${S.payee?' ('+e(S.payee)+')':''}<br>สร้าง QR ตามยอดสุทธิของใบแจ้งหนี้อัตโนมัติ</p></div></div>
<div class="ch" style="margin:24px 0 12px"><h3>อาคารและห้อง</h3><div class="tb2"><input placeholder="ค้นหาห้อง / ผู้เช่า..." value="${e(RQ)}" onchange="RQ=this.value;R()">${ro?'':`<button class="b b2 sm" onclick="go('ten')">ผู้เช่าทั้งหมด</button>`}</div></div>
<div class="cd"><div class="ch"><div class="fh"><i class="ci">▦</i><b>อาคาร</b><span class="pl g">3 ชั้น</span><span class="pl g">${N} ห้อง</span><span class="pl y">${fr} ว่าง</span></div><button class="b b2 sm" onclick="RV=${RV?0:1};R()">${RV?'✓ ':''}เฉพาะห้องว่าง</button></div>${fls||'<p class="mu">ไม่พบห้อง</p>'}</div>`},
ten(){const T=D.users.filter(u=>u.role=='tenant'),inn=T.filter(u=>!u.out),outn=T.filter(u=>u.out),od=new Set(D.inv.filter(i=>i.s=='unpaid'&&late(i)>0).map(i=>(tu(i)||{}).id)),
 soon=inn.filter(u=>u.ce&&u.ce>Date.now()&&u.ce-Date.now()<60*864e5).length,q=TQ.trim().toLowerCase(),
 L=(TT=='in'?inn:outn).filter(u=>(!q||(u.name+u.email+(u.tel||'')+(u.room||'')).toLowerCase().includes(q))&&(!TS||(TS=='od'?od.has(u.id):!u.room))).sort((a,b)=>(a.room||0)-(b.room||0));
 return hdr(PI,'ผู้เช่า',`${T.length} ราย`,`<button class="b" onclick="at0()">+ เพิ่มผู้เช่า</button>`)+`<div class="s4c">${[[inn.length,'ใช้งาน','#dc2626'],[od.size,'ค้างชำระ','#ef4444'],[soon,'ใกล้หมดสัญญา (60 วัน)','#f59e0b'],[outn.length,'อดีตผู้เช่า','#6b7280']].map(x=>`<div class="cd"><div class="k" style="color:${x[2]}">${x[0]}</div><small class="mu">${x[1]}</small></div>`).join('')}</div>
<div class="tabs" style="max-width:320px"><span class="${TT=='in'?'on':''}" onclick="TT='in';R()">ปัจจุบัน (${inn.length})</span><span class="${TT=='in'?'':'on'}" onclick="TT='out';R()">อดีต (${outn.length})</span></div>
<div class="tb2" style="margin:14px 0"><input placeholder="ค้นหาผู้เช่า..." value="${e(TQ)}" onchange="TQ=this.value;R()" style="min-width:260px"><select onchange="TS=this.value;R()"><option value="">สถานะ: ทั้งหมด</option><option value="od" ${TS=='od'?'selected':''}>ค้างชำระ</option><option value="nr" ${TS=='nr'?'selected':''}>รอจัดห้อง</option></select></div>
<div class="cd sc" style="padding:8px 18px"><table><tr><th>ผู้เช่า</th><th>ที่ตั้ง</th><th>ค่าเช่าต่อเดือน</th><th>สัญญา</th><th>เงินแรกเข้า</th><th></th><th></th></tr>${L.map(u=>`<tr><td><span class="tc">${av(u,40)}<span><b>${e(u.name)}</b> ${u.out?'<span class="pl" style="color:#94a3b8;border-color:#334155;background:#0f172a">ย้ายออกแล้ว</span>':'<span class="pl g">ใช้งาน</span>'}<br><small class="mu">${e(u.tel||'-')} · ${e(u.email)}</small></span></span></td><td>${PN()}<br><small class="mu">${u.room?'ห้อง '+u.room+' · ห้องปรับอากาศ':'<span class="pl y">รอจัดห้อง</span>'}</small></td><td><b class="ac">฿${fm(D.set.rent)}/เดือน</b></td><td><small class="mu">${dt(u.cs||u.id)} → ${u.ce?dt(u.ce):'ไม่กำหนด'}</small></td><td>฿${fm(D.set.dep)}</td><td>${u.room?`<button class="b b2 sm" onclick="rm(${u.room})">ดูห้อง →</button>`:`<button class="b sm" onclick="asr(${u.id})">จัดห้อง</button>`}</td><td><span class="mm" onclick="mnu(event,this)">⋯<span class="mdd"><button onclick="et(${u.id})">แก้ไข</button><button onclick="th(${u.id})">ประวัติชำระ</button>${u.out?`<button onclick="rv(${u.id})">ย้ายกลับเข้าพัก</button>`:`<button onclick="mv(${u.id})">ย้ายออก</button>`}</span></span></td></tr>`).join('')||'<tr><td colspan=7 class=mu>ไม่มีผู้เช่า</td></tr>'}</table></div>`},
met(){const ps=pall();if(!ps.includes(PER))PER=ps.includes(dper())?dper():ps[0];MK=ps.map(p=>p+(plock(p)?'L':'O')).join();const L=plock(PER),oc=D.rooms.filter(r=>tn(r.n)),
 bn=L?`<div class="note" style="border-color:#f59e0b88">🔒 รอบ ${mon(PER)} ปิดแล้ว (เกินวันที่ 10 ของเดือนถัดไป) · ดูบิลที่ออกไปแล้วได้อย่างเดียว ไม่สามารถออกบิลย้อนหลัง หรือแก้ไขเลขมิเตอร์/ค่าใช้จ่ายได้</div>`:`<div class="note">🟢 รอบ ${mon(PER)} เปิดอยู่ · ออกบิลและแก้ไขได้ถึงวันที่ 10 ของ${mon(padd(PER,1))} (23:59 น.)</div>`;
 return`<h2>มิเตอร์ & ออกบิล</h2><p class="mu">จดมิเตอร์วันที่ 27 · ออกบิลวันที่ 28 · ครบกำหนดวันที่ ${D.set.due} ของเดือนถัดไป · ออกบิลย้อนหลังได้ไม่เกินวันที่ 10 ของเดือนถัดไป</p><div class="cd" style="margin-top:14px"><label>รอบบิล</label><select onchange="PER=this.value;R()">${ps.map(p=>`<option value="${p}" ${p==PER?'selected':''}>${plock(p)?'🔒 ':'🟢 '}${mon(p)}${plock(p)?' (ปิดรอบ)':''}</option>`).join('')}</select>${bn}<div class="sc"><table><tr><th>ห้อง</th><th>ผู้เช่า</th><th>เลขก่อนหน้า</th><th>เลขล่าสุด</th><th>หน่วย</th><th>ค่าไฟ</th><th>ค่าใช้จ่ายเพิ่มเติม</th><th>หมายเหตุ</th><th>รวม (ก่อนค่าปรับ)</th></tr>${oc.map(r=>{const x=gi('INV'+PER.replace('-','')+'-'+r.n);return`<tr><td>${r.n}</td><td>${e(tn(r.n))}</td>${x?`<td>${x.pv} 🔒</td><td>${x.pv+x.u}</td><td>${x.u}</td><td>฿${fm(x.el)}</td><td>${x.x?'฿'+fm(x.x):'-'}</td><td>${e(x.xn||'')}</td><td>฿${fm(base(x))} ${x.s=='unpaid'&&!L?`<button class="b b2 sm" onclick="eb('${x.id}')">แก้ไขบิล</button>`:L?'🔒':'✓'}</td>`:L?`<td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td></td><td class="mu">ไม่ได้ออกบิลรอบนี้</td>`:`<td>${pvOf(r)} 🔒</td><td><input id="m${r.n}" type="number" style="width:110px;margin:0" oninput="lv(${r.n})"></td><td id="u${r.n}">-</td><td id="a${r.n}">-</td><td><input id="x${r.n}" type="number" placeholder="0" style="width:100px;margin:0" oninput="lv(${r.n})"></td><td><input id="xn${r.n}" placeholder="เช่น ค่าซ่อม" style="width:140px;margin:0"></td><td id="t${r.n}">-</td>`}</tr>`}).join('')}</table></div>${L?'':'<br><button class="b" onclick="iss()">ออกใบแจ้งหนี้</button>'}</div>`},
pay(){return`<h2>รับชำระเงิน</h2><p class="mu">ตรวจสอบสลิป อนุมัติ/ปฏิเสธ และรับเงินสด</p><div class="cd" style="margin-top:14px">${flt()}${tbl()}</div>`},
rep(){const g={};D.inv.forEach(i=>{const x=g[i.per]=g[i.per]||{n:0,t:0,p:0,w:0,u:0};const v=tot(i);x.n++;x.t+=v;i.s=='paid'?x.p+=v:i.s=='pending'?x.w+=v:x.u+=v});
 return`${repTop()}${ch(g)}<div class="cd sc" style="margin-top:14px"><h3 style="margin-bottom:10px">สรุปรายเดือน</h3><table><tr><th>รอบบิล</th><th>จำนวนบิล</th><th>ยอดรวม</th><th>ชำระแล้ว</th><th>รอตรวจสอบ</th><th>ค้างชำระ</th></tr>${Object.keys(g).sort().reverse().map(k=>`<tr><td>${mon(k)}</td><td>${g[k].n}</td><td>฿${fm(g[k].t)}</td><td class="ac">฿${fm(g[k].p)}</td><td>฿${fm(g[k].w)}</td><td>฿${fm(g[k].u)}</td></tr>`).join('')||'<tr><td colspan=6 class=mu>ยังไม่มีข้อมูล</td></tr>'}</table></div>${U.role=='owner'?rcTable():''}<div class="cd" style="margin-top:14px"><h3>กล่องอีเมลอัตโนมัติ</h3><small class="mu">ใบแจ้งหนี้ส่งเมื่อออกบิล · ใบเสร็จส่งเมื่อยืนยันการชำระ</small><div class="sc"><table><tr><th>เวลา</th><th>ถึง</th><th>เรื่อง</th><th>สถานะ</th><th></th></tr>${(D.mail||[]).slice(0,15).map((m,x)=>`<tr><td>${new Date(m.t).toLocaleString(LOCF())}</td><td>${e(m.to)}</td><td>${e(m.sj)}</td><td>${m.st=='ok'?'<span class="pl g">ส่งแล้ว</span>':m.st=='fail'?'<span class="pl r">ส่งไม่สำเร็จ</span>':m.st=='wait'?'<span class="pl y">รอตั้งค่า</span>':'<span class="pl y">กำลังส่ง</span>'}${m.er?`<br><small class="mu">${e(m.er)}</small>`:''}</td><td><button class="b b2 sm" onclick="pv(${x})">ดูอีเมล</button> ${m.st!='ok'&&m.st!='sending'?`<button class="b sm" onclick="rs2(${x})">ส่งซ้ำ</button>`:''}</td></tr>`).join('')||'<tr><td colspan=5 class=mu>ยังไม่มีอีเมล</td></tr>'}</table></div></div><div class="cd" style="margin-top:14px"><h3>Audit Log</h3><br>${D.log.map(l=>`<div class="bd mu"><span>${e(l.by)} · ${e(l.a)}</span><span>${new Date(l.t).toLocaleString(LOCF())}</span></div>`).join('')||'<span class="mu">ยังไม่มีบันทึก</span>'}</div>`},
set(){const s=D.set,f=(k,l,u)=>`<div class="cd"><label>${l}</label><div style="display:flex;align-items:center;gap:8px"><input id="s_${k}" value="${e(s[k]??'')}"><small class="mu">${u}</small></div></div>`;
 return`<h2>ตั้งค่าระบบ</h2><p class="mu">แก้ไขกฎการคำนวณค่าบริการ</p><div class="cd" style="margin-top:14px"><h3>กฎการเรียกเก็บเงิน</h3><small class="mu">แก้ไขแล้วกดบันทึก ระบบจะใช้กับใบแจ้งหนี้รอบถัดไป</small><div class="g4 sg" style="grid-template-columns:repeat(3,1fr)">${f('rent','ค่าเช่าห้องพัก','บาท/เดือน')}${f('rate','ค่าไฟฟ้า','บาท/หน่วย')}${f('dep','เงินแรกเข้า','บาท')}${f('due','วันครบกำหนดชำระ','ของเดือน')}${f('max','ค่าปรับสูงสุด','บาท')}${f('pp','PromptPay (เบอร์/เลข ปชช.)','บัญชี SCB')}${f('tax','เลขประจำตัวผู้เสียภาษี','')}${f('name','ชื่อหอพัก (บนเอกสาร)','')}${f('payee','ชื่อผู้รับเงิน','')}${f('tel','เบอร์ติดต่อ','')}${f('addr','ที่อยู่','')}${f('url','ลิงก์เว็บระบบ (ใส่ในอีเมล)','')}${f('ejs','EmailJS Service ID','')}${f('ejt','EmailJS Template ID','')}${f('ejk','EmailJS Public Key','')}</div><button class="b" onclick="ss()">บันทึกการตั้งค่า</button></div>`}};
function ss(){const s=D.set;['rent','rate','dep','due','max'].forEach(k=>s[k]=+$('#s_'+k).value||0);['pp','tax','name','payee','tel','addr','url','ejs','ejt','ejk'].forEach(k=>s[k]=$('#s_'+k).value.trim());lg('แก้ไขการตั้งค่า');save();tt('✓ บันทึกแล้ว')}
function rg(){return`<div class="rg">${D.rooms.map(r=>{const n=tn(r.n);return`<div class="rm ${n||r.st=='busy'?'o':r.st=='maint'?'m':''}" onclick="rm(${r.n})"><b>${r.n}</b>${n?e(n):r.st=='busy'?'ไม่ว่าง':r.st=='maint'?'ปิดปรับปรุง':'ว่าง'}</div>`}).join('')}</div>`}
function rm(n){if(U.role=='owner')return;const r=D.rooms.find(x=>x.n==n),t=act(n),s=t?'busy':r.st||'free',o=(v,l)=>`<option value="${v}" ${s==v?'selected':''}>${l}</option>`;
 mo(`<h3>ห้อง ${n}</h3><label>สถานะห้อง</label><select id="rs">${o('free','ว่าง')}${o('busy',t?'ไม่ว่าง (มีผู้เช่า)':'ไม่ว่าง')}${o('maint','ปิดปรับปรุง')}</select><label>เลขมิเตอร์ล่าสุด</label><input id="rmm" type="number" value="${r.m}" ${D.inv.some(i=>i.room==n)?'disabled':''}>${t?`<p>${e(t.name)}<br><small class="mu">${e(t.email)}${t.tel?' · '+e(t.tel):''}</small></p><small class="mu">เลือก “ว่าง” หรือ “ปิดปรับปรุง” เพื่อย้ายผู้เช่าออกพร้อมเปลี่ยนสถานะห้อง</small><br><br><button class="b" onclick="rsv(${n})">บันทึก</button> <button class="b b2" onclick="et(${t.id})">แก้ไขผู้เช่า</button> <button class="b b2" onclick="mv(${t.id})">ย้ายออก</button>`:`<button class="b" onclick="rsv(${n})">บันทึกสถานะ</button>${s=='free'?`${UN().length?`<hr style="border-color:var(--ln);margin:18px 0"><h3>จัดผู้เช่าที่ลงทะเบียนแล้วเข้าห้องนี้</h3><label>เลือกผู้เช่า</label><select id="as_u">${UN().map(u=>`<option value="${u.id}">${e(u.name)} · ${e(u.tel||u.email)}</option>`).join('')}</select><button class="b" onclick="asg(+$('#as_u').value,${n})">จัดเข้าห้อง ${n}</button>`:''}<hr style="border-color:var(--ln);margin:18px 0"><h3>เพิ่มผู้เช่า</h3><label>ชื่อ - นามสกุล</label><input id="an"><label>เบอร์โทร</label><input id="at"><label>อีเมล</label><input id="ae"><label>รหัสผ่าน</label><input id="ap" value="${genPw()}"><button class="b" onclick="ad(${n})">เพิ่มผู้เช่า</button>`:''}`} <button class="b b2" onclick="cm()">ปิด</button>`)}
function rsv(n){const r=D.rooms.find(x=>x.n==n),t=act(n),v=$('#rmm').value,sv=$('#rs').value,li=D.inv.filter(i=>i.room==n).sort((a,b)=>a.per<b.per?1:-1)[0];if(v!==''&&+v!=r.m&&li)return alert('เลขมิเตอร์ถูกล็อกตามบิลล่าสุดของห้องนี้ ('+mon(li.per)+') แก้ได้ที่เมนู มิเตอร์ & ออกบิล > แก้ไขบิล (ก่อนปิดรอบ)');const fin=()=>{if(v!==''&&+v>=0)r.m=+v;if(!t||sv!='busy')r.st=sv=='free'?'':sv;lg('แก้ไขสถานะห้อง '+n);save();cm();R();tt('✓ บันทึกสถานะห้อง '+n+' แล้ว')};
 if(t&&sv!='busy'){const k=D.inv.filter(i=>(i.uid?i.uid==t.id:i.room==n)&&i.s!='paid').length;
  return cf('เปลี่ยนเป็น'+(sv=='maint'?'ปิดปรับปรุง':'ว่าง')+' จะย้ายผู้เช่า '+t.name+' ออกจากห้อง'+(k?'\nมีบิลค้าง '+k+' รายการ จะยังอยู่ในประวัติผู้เช่าเดิม':'')+'\nยืนยัน?',()=>{t.out=Date.now();lg('ย้ายออก ห้อง '+n);fin()})}
 fin()}
function et(id){const u=D.users.find(x=>x.id==id),fr=D.rooms.filter(r=>vac(r)||r.n==u.room);
 mo(`<h3>แก้ไขข้อมูลผู้เช่า</h3><label>ชื่อ - นามสกุล</label><input id="f_n" value="${e(u.name)}"><label>เบอร์โทร</label><input id="f_t" value="${e(u.tel||'')}"><label>อีเมล</label><input id="f_e" value="${e(u.email)}"><label>สถานะผู้เช่า</label><select id="f_s"><option value="in" ${u.out?'':'selected'}>ยังอยู่</option><option value="out" ${u.out?'selected':''}>ย้ายออกแล้ว</option></select><label>ห้องพัก</label><select id="f_r">${u.room?'':'<option value="">ยังไม่จัดห้อง</option>'}${fr.map(r=>`<option ${r.n==u.room?'selected':''}>${r.n}</option>`).join('')}</select><label>รหัสผ่านใหม่ (เว้นว่างถ้าไม่เปลี่ยน)</label><input id="f_w" type="password"><button class="b" onclick="eu(${id})">บันทึก</button> <button class="b b2" onclick="cm()">ยกเลิก</button>`)}
function eu(id){const u=D.users.find(x=>x.id==id),n=$('#f_n').value.trim(),m=$('#f_e').value.trim().toLowerCase(),r=+$('#f_r').value,w=$('#f_w').value,go2=$('#f_s').value=='out';
 if(!n||!m)return alert('กรอกชื่อและอีเมล');if(D.users.some(x=>x.id!=id&&x.email==m))return alert('อีเมลนี้ถูกใช้แล้ว');if(w&&w.length<4)return alert('รหัสผ่านสั้นเกินไป');
 if(!go2&&r){const o=act(r),rr=D.rooms.find(x=>x.n==r);if(o&&o.id!=id)return alert('ห้อง '+r+' มีผู้เช่าอยู่แล้ว');if(rr.st)return alert('ห้อง '+r+' ไม่ว่าง/ปิดปรับปรุง กรุณาเปลี่ยนสถานะห้องเป็นว่างก่อน')}
 if(!u.room&&r)u.cs=Date.now();Object.assign(u,{name:n,email:m,tel:$('#f_t').value.trim(),room:r||null});if(w)u.pw=w;if(go2){if(!u.out)u.out=Date.now()}else delete u.out;lg('แก้ไขผู้เช่า '+n);save();cm();R();tt('✓ บันทึกข้อมูลผู้เช่าแล้ว')}
function rv(id){const u=D.users.find(x=>x.id==id),rr=D.rooms.find(x=>x.n==u.room);if(act(u.room))return alert('ห้อง '+u.room+' มีผู้เช่าอยู่แล้ว');if(rr.st)return alert('ห้อง '+u.room+' ไม่ว่าง/ปิดปรับปรุง กรุณาเปลี่ยนสถานะห้องเป็นว่างก่อน');delete u.out;lg('ย้ายกลับเข้าพัก ห้อง '+u.room);save();R();tt('✓ ย้ายกลับเข้าพักแล้ว')}
function eb(id){const i=gi(id);if(plock(i.per))return alert(LKM(i.per));if(i.s!='unpaid')return alert('บิลนี้รอตรวจสอบหรือชำระแล้ว จึงแก้ไขไม่ได้\n(ถ้าผู้เช่าส่งสลิปผิด ให้ปฏิเสธสลิปก่อน แล้วค่อยแก้ไขบิล)');
 const last=!D.inv.some(k=>k.room==i.room&&k.per>i.per);
 mo(`<h3>แก้ไขบิล ${id}</h3><label>เลขมิเตอร์ก่อนหน้า 🔒</label><input value="${i.pv}" disabled><label>เลขมิเตอร์ล่าสุด</label><input id="eb_m" type="number" value="${i.pv+i.u}" ${last?'':'disabled'}>${last?'':'<small class="mu">แก้เลขมิเตอร์ไม่ได้ เพราะออกบิลรอบถัดไปของห้องนี้แล้ว</small>'}<label>ค่าใช้จ่ายเพิ่มเติม (บาท)</label><input id="xa" type="number" value="${i.x||''}"><label>หมายเหตุ</label><input id="xb" value="${e(i.xn||'')}"><div class="note">แก้ไขได้จนกว่าผู้เช่าจะแจ้งชำระ หรือปิดรอบบิล (เกินวันที่ 10 ของเดือนถัดไป)</div><button class="b" onclick="ebs('${id}')">บันทึก</button> <button class="b b2" onclick="cm()">ยกเลิก</button>`)}
function ebs(id){const i=gi(id);if(plock(i.per))return alert(LKM(i.per));if(i.s!='unpaid')return alert('บิลนี้รอตรวจสอบหรือชำระแล้ว จึงแก้ไขไม่ได้');
 const last=!D.inv.some(k=>k.room==i.room&&k.per>i.per),m=$('#eb_m');
 if(last&&m&&m.value!==''){const v=+m.value;if(!Number.isInteger(v)||v<i.pv)return alert('เลขมิเตอร์ล่าสุดต้องเป็นจำนวนเต็มและไม่น้อยกว่าเลขก่อนหน้า ('+i.pv+')');
  const rt=i.u>0?i.el/i.u:D.set.rate,r=D.rooms.find(x=>x.n==i.room);i.u=v-i.pv;i.el=Math.round(i.u*rt*100)/100;if(r)r.m=v}
 const x=+$('#xa').value||0;if(x<0)return alert('ค่าใช้จ่ายเพิ่มเติมต้องไม่ติดลบ');
 i.x=x;i.xn=$('#xb').value.trim();lg('แก้ไขบิล '+id);save();cm();R();tt('✓ แก้ไขบิลแล้ว')}
function ex(id){const i=gi(id);if(plock(i.per))return alert(LKM(i.per));mo(`<h3>ค่าใช้จ่ายเพิ่มเติม ${id}</h3><label>จำนวนเงิน (บาท)</label><input id="xa" type="number" value="${i.x||''}"><label>หมายเหตุ</label><input id="xb" value="${e(i.xn||'')}"><button class="b" onclick="sx('${id}')">บันทึก</button> <button class="b b2" onclick="cm()">ยกเลิก</button>`)}
function sx(id){const i=gi(id);if(plock(i.per))return alert(LKM(i.per));i.x=+$('#xa').value||0;i.xn=$('#xb').value.trim();lg('แก้ไขค่าอื่น '+id);save();cm();R()}
function ad(n){const a=$('#an').value.trim(),m=$('#ae').value.trim().toLowerCase(),p=$('#ap').value;if(!a||!m||!p||D.users.some(u=>u.email==m))return alert('ข้อมูลไม่ครบหรืออีเมลซ้ำ');D.users.push({id:Date.now(),name:a,email:m,pw:p,role:'tenant',room:n,tel:$('#at').value.trim()});lg('เพิ่มผู้เช่า ห้อง '+n);save();cm();R()}
function mv(id){const u=D.users.find(x=>x.id==id),k=D.inv.filter(i=>(i.uid?i.uid==id:i.room==u.room)&&i.s!='paid').length;
 cf('ยืนยันย้ายออก '+u.name+' (ห้อง '+u.room+')?\nสถานะห้องจะเปลี่ยนเป็น "ว่าง"'+(k?'\nมีบิลค้างชำระ '+k+' รายการ จะยังอยู่ในประวัติของผู้เช่าคนนี้':''),()=>{u.out=Date.now();lg('ย้ายออก ห้อง '+u.room);save();cm();R();tt('✓ ย้ายออกแล้ว ห้อง '+u.room+' ว่าง')})}
function BLD(z){return`<i class="ci" style="width:${z}px;height:${z}px;flex:0 0 auto"><svg viewBox="0 0 24 24" width="${Math.round(z*.56)}" height="${Math.round(z*.56)}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16"/><path d="M14 10h5a1 1 0 0 1 1 1v10"/><path d="M3 21h18"/><path d="M8 8h2M8 12h2M8 16h2M17 14h.01M17 17h.01"/></svg></i>`}
// ---- ข้อมูลสรุปแบบสาธารณะ (ไม่มีชื่อผู้เช่า) สำหรับแดชบอร์ดตัวอย่างหน้าต้อนรับ: โหลดใหม่ทุก 1 ชั่วโมง ----
var PUBD=null,PUBT=0;
function withPub(f){const o={rooms:D.rooms,users:D.users,inv:D.inv,set:D.set};D.rooms=PUBD.rooms;D.users=PUBD.users;D.inv=PUBD.inv;D.set=Object.assign({},o.set);Object.keys(PUBD.set).forEach(k=>{if(PUBD.set[k]!==undefined)D.set[k]=PUBD.set[k]});try{return f()}finally{D.rooms=o.rooms;D.users=o.users;D.inv=o.inv;D.set=o.set}}
function pubBuild(d){const rr=d.rooms||[],occ=new Set(rr.filter(r=>r.st=='occ').map(r=>+r.n)),s=d.set||{};
 return{rooms:rr.map(r=>({n:+r.n,m:0,st:(r.st=='busy'||r.st=='maint')?r.st:undefined})),
  users:[...occ].map(n=>({id:'p'+n,name:'ห้อง '+n,role:'tenant',room:n})),
  inv:(d.inv||[]).filter(v=>v&&typeof v=='object'&&/^\d{4}-\d{2}$/.test(v.per||'')&&+v.room>0).map(v=>({id:v.code,room:+v.room,uid:'p'+v.room,per:v.per,pv:0,u:0,el:+v.el||0,x:+v.x||0,xn:'',rent:+v.rent||0,fine:+v.fine||0,s:v.s=='overdue'?'unpaid':v.s,iss:v.iss?Date.parse(v.iss):0,paid:v.paid?Date.parse(v.paid):undefined})),
  set:{rent:+s.rent||undefined,rate:+s.rate||undefined,dep:+s.dep||undefined,due:+s.due||undefined,max:+s.max||undefined,fpd:+s.fpd||undefined,name:s.name||undefined}}}
const PUB_STATS=false; /* ปิดแดชบอร์ดสาธารณะ: หน้าต้อนรับใช้ข้อมูลตัวอย่าง ไม่ดึงข้อมูลจริง (เปิดได้โดยรันไฟล์ 06 แล้วเปลี่ยนเป็น true) */
async function pubLoad(force){if(!PUB_STATS||!SBON||!SBX.cl||U)return;if(!force&&PUBD&&Date.now()-PUBT<36e5)return;
 try{const{data,error}=await SBX.cl.rpc('public_stats');if(error||!data)return;PUBD=pubBuild(data);PUBT=Date.now();if(!U&&P=='home')R()}catch(x){}}
setInterval(()=>pubLoad(true),36e5);document.addEventListener('visibilitychange',()=>{if(!document.hidden)pubLoad()});
function pall(){const c=pcur(),pv=padd(c,-1),ks=D.inv.map(i=>i.per).filter(Boolean).sort(),e0=ks.length&&ks[0]<pv?ks[0]:pv,o=[];let p=c,n=0;while(p>=e0&&n<60){o.push(p);p=padd(p,-1);n++}return o}
function mbl(){document.querySelectorAll('.mn table').forEach(t=>{const hr=[...t.rows].find(r=>r.querySelector('th'));if(!hr)return;const hs=[...hr.cells].map(c=>c.textContent.trim());t.classList.add('rt');[...t.rows].forEach(r=>{if(r===hr){r.classList.add('rh');return}let i=0;[...r.cells].forEach(c=>{if(c.colSpan>1){i+=c.colSpan;return}if(hs[i])c.setAttribute('data-l',hs[i]);i++})})})}
const LKM=p=>'รอบบิล '+mon(p)+' ปิดแล้ว (เกินวันที่ 10 ของเดือนถัดไป) ไม่สามารถออกบิลย้อนหลังหรือแก้ไขเลขมิเตอร์/ค่าใช้จ่ายได้';
let MV={},MK='';
function mtick(){if(!U||P!='met')return;const k=pall().map(p=>p+(plock(p)?'L':'O')).join();if(MK&&k!=MK){const busy=getComputedStyle($('#mo')).display!='none'||/INPUT|SELECT|TEXTAREA/.test((document.activeElement||{}).tagName||'');if(busy)return;MK=k;R()}else MK=k}
setInterval(mtick,30000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)mtick()});
function pvOf(r){const l=D.inv.filter(i=>i.room==r.n).sort((a,b)=>a.per<b.per?1:-1)[0];return l?l.pv+l.u:r.m} // เลขก่อนหน้า = เลขล่าสุดของบิลล่าสุด (ล็อก ไม่ให้พิมพ์แก้)
function lv(n){const r=D.rooms.find(x=>x.n==n),v=$('#m'+n).value,u=v===''?null:+v-pvOf(r),x=+$('#x'+n).value||0,el=u==null||u<0?null:u*D.set.rate;$('#u'+n).textContent=u==null?'-':u;$('#a'+n).textContent=el==null?'-':'฿'+fm(el);$('#t'+n).textContent=el==null?'-':'฿'+fm(el+x+D.set.rent)}
function iss(){if(plock(PER))return alert(LKM(PER));const[y,m]=PER.split('-').map(Number);if(new Date()<new Date(y,m-1,27))return cf('ยังไม่ถึงวันจดมิเตอร์ (27) ต้องการออกบิลต่อหรือไม่?',iss2);iss2()}
function iss2(){let c=0;if(plock(PER))return alert(LKM(PER));
 for(const r of D.rooms.filter(r=>tn(r.n))){const el=$('#m'+r.n);if(!el||el.value==='')continue;const v=+el.value,p0=pvOf(r);if(D.inv.some(i=>i.room==r.n&&i.per>PER))return alert('ห้อง '+r.n+': มีบิลของเดือนถัดไปออกแล้ว ไม่สามารถออกบิลย้อนหลังได้');if(v<p0)return alert('ห้อง '+r.n+': เลขมิเตอร์ต้องไม่น้อยกว่าเดิม ('+p0+')');
  D.inv.push({id:'INV'+PER.replace('-','')+'-'+r.n,room:r.n,uid:act(r.n).id,per:PER,pv:p0,u:v-p0,el:(v-p0)*D.set.rate,x:+$('#x'+r.n).value||0,xn:$('#xn'+r.n).value.trim(),rent:D.set.rent,fine:0,s:'unpaid',iss:Date.now()});r.m=v;c++}
 if(c){lg('ออกบิล '+c+' ห้อง รอบ '+PER);save();D.inv.slice(-c).forEach(i=>mail('inv',i));tt('✓ ออกใบแจ้งหนี้ '+c+' ห้อง · เพิ่มคิวส่งอีเมลแล้ว');R()}else alert('ยังไม่ได้กรอกเลขมิเตอร์ใหม่')}
// ---- tenant pages ----
pg.my=()=>{const l=D.inv.filter(i=>mine(i)&&i.s!='paid');
 return`<h2>ใบแจ้งหนี้ของฉัน</h2><p class="mu">${U.room?'ห้อง '+U.room:'ยังไม่ได้จัดห้อง'} · ${e(U.name)}</p>${U.room?'':'<div class="note">⏳ ลงทะเบียนสำเร็จแล้ว รอผู้ดูแลจัดห้องพักให้ จึงจะมีใบแจ้งหนี้</div>'}<div class="note">💵 ชำระผ่าน PromptPay QR · หากต้องการชำระเงินสด สามารถชำระได้ที่หน้าเคาน์เตอร์</div><div style="margin-top:14px;display:grid;gap:14px">${l.map(i=>{const s=st(i);return`<div class="cd"><div style="display:flex;justify-content:space-between"><b>${mon(i.per)}</b>${pill(i)}</div><div class="big">฿${fm(tot(i))}</div><div class="bd mu"><span>ค่าเช่า</span><span>฿${fm(i.rent)}</span></div><div class="bd mu"><span>ค่าไฟ ${i.u} หน่วย × ${D.set.rate}</span><span>฿${fm(i.el)}</span></div>${i.x?`<div class="bd mu"><span>${e(i.xn||'ค่าใช้จ่ายเพิ่มเติม')}</span><span>฿${fm(i.x)}</span></div>`:''}${tot(i)>base(i)?`<div class="bd" style="color:#fb7185"><span>ค่าปรับ</span><span>฿${fm(tot(i)-base(i))}</span></div>`:''}<p class="mu">ครบกำหนด ${dt(due(i))}</p>${i.s=='unpaid'&&i.rj?`<div class="note" style="background:#fee2e2;color:#b91c1c;border-color:#fecaca">⚠ สลิปถูกปฏิเสธ: ${e(i.rj)}<br>กรุณาตรวจสอบแล้วส่งสลิปใหม่</div>`:''}${i.s=='pending'?'<span class="mu">รอผู้ดูแลตรวจสอบ · ส่งสลิปผิดแก้ไขได้ก่อนผู้ดูแลยืนยัน</span> ':''}<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px"><button class="b" onclick="vi('${i.id}')">ดูใบแจ้งหนี้</button>${i.s=='pending'&&i.mt!='cash'?`<button class="b b2" onclick="pm('${i.id}')">แก้ไข/ส่งสลิปใหม่</button>`:''}</div></div>`}).join('')||'<div class="cd mu">ไม่มีบิลค้างชำระ 🎉</div>'}</div>`};
pg.hist=()=>{const l=D.inv.filter(i=>mine(i)&&i.s=='paid');return`<h2>ประวัติ & ใบเสร็จ</h2><div class="cd sc" style="margin-top:14px"><table><tr><th>รอบบิล</th><th>ยอด</th><th>วันที่ชำระ</th><th></th></tr>${l.map(i=>`<tr><td>${mon(i.per)}</td><td>฿${fm(tot(i))}</td><td>${dt(i.paid)}</td><td><button class="b b2 sm" onclick="rc('${i.id}')">ใบเสร็จ</button></td></tr>`).join('')||'<tr><td colspan=4 class=mu>ยังไม่มีประวัติ</td></tr>'}</table></div>`};
const fz=i=>i.s=='pending'?(i.fine||0):fine(i); // ส่งสลิปใหม่: ค่าปรับคงตามวันที่แจ้งชำระครั้งแรก
function pm(id){const i=gi(id),pd=i.s=='pending',f=fz(i),t=base(i)+f;SLIP=null;
 mo(`<div class="mh"><h3>${pd?'แก้ไขสลิป · ส่งสลิปใหม่':'ชำระเงินผ่าน PromptPay'}</h3><span class="mu">${i.id}</span></div>
 <div class="amt"><small>ยอดที่ต้องชำระ</small><div class="big">฿${fm(t)}</div><small>ครบกำหนด ${dt(due(i))}${late(i)>0?` · <b style="color:#fb7185">เลยกำหนด ${late(i)} วัน</b>`:''}</small></div>
 <div class="bk"><div class="bd"><span>ค่าเช่า</span><span>฿${fm(i.rent)}</span></div><div class="bd"><span>ค่าไฟ ${i.u} หน่วย</span><span>฿${fm(i.el)}</span></div>${i.x?`<div class="bd"><span>${e(i.xn||'ค่าใช้จ่ายเพิ่มเติม')}</span><span>฿${fm(i.x)}</span></div>`:''}${f?`<div class="bd" style="color:#fb7185"><span>ค่าปรับ (นับถึงวันที่แจ้งชำระ)</span><span>฿${f}</span></div>`:''}</div>
 ${pd?'<div class="note">ผู้ดูแลยังไม่ได้ยืนยัน จึงส่งสลิปใหม่ได้ · เมื่อผู้ดูแลยืนยันแล้วจะแก้ไขไม่ได้</div>':''}${!pd&&i.rj?`<div class="note" style="background:#fee2e2;color:#b91c1c;border-color:#fecaca">⚠ สลิปครั้งก่อนถูกปฏิเสธ: ${e(i.rj)}</div>`:''}<div class="st"><b>1</b> สแกน QR ด้วยแอปธนาคาร</div><div class="qrc"><div class="qr" id="qr"></div><small class="mu">ยอดเงินจะขึ้นอัตโนมัติ ไม่ต้องกรอกเอง</small></div>
 <div class="st"><b>2</b> อัปโหลดสลิปโอนเงิน (JPG/PNG)</div><input type="file" id="sf" accept="image/jpeg,image/png" onchange="sl(this)">
 <button class="b" style="width:100%" onclick="sub('${id}')">${pd?'ส่งสลิปใหม่':'แจ้งชำระเงิน'}</button>
 <div class="note">💵 หากต้องการชำระเงินสด สามารถชำระได้ที่หน้าเคาน์เตอร์</div>
 <button class="b b2 sm" style="margin-top:8px" onclick="vi('${id}')">‹ กลับไปดูใบแจ้งหนี้</button>`);tm(id)}
function tm(id){const i=gi(id);
 try{const k=qrcode(0,'M');k.addData(ppay(D.set.pp,base(i)+fz(i)));k.make();$('#qr').innerHTML=k.createSvgTag(5,2)}catch(x){$('#qr').textContent='สร้าง QR ไม่สำเร็จ'}}
function sl(el){const f=el.files[0];if(!f)return;if(!/^image\/(jpeg|png)$/.test(f.type)||f.size>8e6){el.value='';return alert('รองรับเฉพาะ JPG/PNG ไม่เกิน 8MB')}
 const r=new FileReader;r.onload=()=>{const m=new Image;m.onload=()=>{const k=Math.min(1,800/Math.max(m.width,m.height)),c=document.createElement('canvas');c.width=m.width*k;c.height=m.height*k;c.getContext('2d').drawImage(m,0,0,c.width,c.height);SLIP=c.toDataURL('image/jpeg',.7)};m.src=r.result};r.readAsDataURL(f)}
function sub(id){const i=gi(id);if(!SLIP)return alert('กรุณาอัปโหลดสลิปโอนเงิน');
 if(i.s!='pending')i.fine=fine(i);delete i.rj;i.mt='qr';i.sub=Date.now();i.slip=SLIP;i.s='pending';lg('แจ้งชำระ '+id);save();cm();R();tt('✓ แจ้งชำระเงินแล้ว รอผู้ดูแลตรวจสอบ')}
const ch=g=>{const k=Object.keys(g).sort().slice(-6),m=Math.max(1,...k.map(x=>g[x].t));return k.length?`<div class="cd" style="margin-top:14px"><h3>รายได้ 6 เดือนล่าสุด</h3><br>${k.map(x=>`<div class="bd"><small class="mu" style="width:110px">${mon(x)}</small><div class="pb" style="flex:1;margin:8px 10px"><i style="width:${Math.round(g[x].p/m*100)}%"></i></div><small>฿${fm(g[x].p)}</small></div>`).join('')}<small class="mu">แถบ = ยอดที่ชำระแล้วเทียบกับยอดรวมสูงสุดของเดือน</small></div>`:''};
const nrc=()=>{if(SBON)return'(กำลังออกเลขที่)';const d=new Date();return 'RC'+d.getFullYear()+pad(d.getMonth()+1)+'-'+String(D.inv.filter(x=>x.rc).length+1).padStart(4,'0')};
function bahtText(n){n=Math.round(n*100)/100;const N0=['ศูนย์','หนึ่ง','สอง','สาม','สี่','ห้า','หก','เจ็ด','แปด','เก้า'],PL=['','สิบ','ร้อย','พัน','หมื่น','แสน'];
 const rd=x=>{let r='';const t=String(x);for(let k=0;k<t.length;k++){const d=+t[k],p=t.length-k-1;if(!d)continue;if(p==1)r+=(d==1?'':d==2?'ยี่':N0[d])+'สิบ';else if(p==0)r+=(d==1&&t.length>1?'เอ็ด':N0[d]);else r+=N0[d]+PL[p]}return r},
 mm=x=>x<1e6?rd(x):mm(Math.floor(x/1e6))+'ล้าน'+(x%1e6?rd(x%1e6):''),b=Math.floor(n),sa=Math.round((n-b)*100);
 return b||sa?(b?mm(b)+'บาท':'')+(sa?rd(sa)+'สตางค์':'ถ้วน'):'ศูนย์บาทถ้วน'}
function rcpHTML(i){const S=D.set,u=tu(i)||{},nm=S.name||'T&T Mansion',pe=S.payee||nm,T=tot(i),g='#15803d',
 rows=[['ค่าเช่าห้อง ('+mon(i.per)+')',i.rent,''],['ค่าไฟฟ้า',i.el,'('+i.pv+' - '+(i.pv+i.u)+') ใช้ '+i.u+' หน่วย × '+B(S.rate)+'/หน่วย']];
 if(i.x)rows.push([i.xn||'ค่าใช้จ่ายเพิ่มเติม',i.x,'']);if(i.fine)rows.push(['ค่าปรับล่าช้า',i.fine,'']);
 const bx=(h,b,pd)=>`<td style="width:50%;vertical-align:top;${pd}"><div style="border:1px solid #cbd5e1;border-radius:10px;padding:10px 12px;font-size:12px;color:#475569;line-height:1.6;min-height:78px"><div style="color:#64748b">${h}</div>${b}</div></td>`,
 sg=(n,r)=>`<td style="width:50%;text-align:center;font-size:11px;color:#475569;padding:0 14px"><div style="border-top:1px solid #94a3b8;margin:36px 0 6px"></div>( ${e(n)} )<br>${r}</td>`;
 return`<div class="doc" style="font-family:Anuphan,Tahoma,Arial,sans-serif;max-width:520px;margin:0 auto;background:#fff;color:#0f172a;padding:22px;border-radius:14px;border:1px solid #e2e8f0;text-align:left;font-size:13px">
<table style="width:100%;border-collapse:collapse"><tr><td style="vertical-align:top"><div style="font-size:18px;font-weight:700;color:${g}">${e(nm)}</div><div style="font-size:11px;color:#475569;line-height:1.6">${S.addr?e(S.addr)+'<br>':''}${S.tel?'เบอร์ติดต่อ: '+e(S.tel)+'<br>':''}${S.tax?'เลขประจำตัวผู้เสียภาษี: '+e(S.tax):''}</div></td><td style="vertical-align:top;text-align:right;white-space:nowrap"><div style="font-size:22px;font-weight:700;color:${g}">ใบเสร็จรับเงิน</div><div style="font-size:11px;color:#64748b">Receipt</div></td></tr></table>
<table style="width:100%;border-collapse:collapse;margin:14px 0"><tr><td style="border:1px solid #cbd5e1;border-radius:10px;padding:10px 12px;font-size:12px"><table style="width:100%;border-collapse:collapse"><tr><td style="color:#64748b">เลขที่ใบเสร็จ</td><td style="color:#64748b;text-align:center">อ้างอิงใบแจ้งหนี้</td><td style="color:#64748b;text-align:right">วันที่รับเงิน</td></tr><tr><td style="font-weight:700">${e(i.rc||'-')}</td><td style="font-weight:700;text-align:center">${e(i.id)}</td><td style="font-weight:700;text-align:right">${dt(i.paid)}</td></tr></table></td></tr></table>
<table style="width:100%;border-collapse:collapse"><tr>${bx('ผู้รับเงิน','<b style="color:#0f172a;font-size:14px">'+e(pe)+'</b><br>'+(S.tax?'เลขประจำตัวผู้เสียภาษี: '+e(S.tax)+'<br>':'')+(S.addr?e(S.addr):''),'padding-right:5px')}${bx('ผู้จ่ายเงิน','<b style="color:#0f172a;font-size:14px">'+e(u.name||'-')+'</b><br>ห้อง: '+i.room+(u.tel?' | โทร: '+e(u.tel):''),'padding-left:5px')}</tr></table>
<table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:12px"><tr style="color:#64748b"><td style="padding:6px 4px;border-bottom:2px solid #94a3b8;width:42px">ลำดับ</td><td style="padding:6px 4px;border-bottom:2px solid #94a3b8">รายการ</td><td style="padding:6px 4px;border-bottom:2px solid #94a3b8;text-align:right">จำนวนเงิน</td></tr>${rows.map((r,k)=>`<tr><td style="padding:8px 4px;border-bottom:1px solid #e2e8f0;vertical-align:top">${k+1}</td><td style="padding:8px 4px;border-bottom:1px solid #e2e8f0">${e(r[0])}${r[2]?'<div style="font-size:10px;color:#64748b">'+e(r[2])+'</div>':''}</td><td style="padding:8px 4px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700;vertical-align:top">${Number(r[1]).toLocaleString(LOCF(),{minimumFractionDigits:2})}</td></tr>`).join('')}</table>
<table style="width:100%;border-collapse:collapse;margin-top:14px"><tr><td style="vertical-align:middle"><div style="font-size:15px;font-weight:700;white-space:nowrap">ยอดเงินที่ได้รับ</div><div style="font-size:11px;color:#64748b">(${bahtText(T)})</div></td><td style="text-align:right;vertical-align:middle;white-space:nowrap"><span style="font-size:18px;font-weight:700">${Number(T).toLocaleString(LOCF(),{minimumFractionDigits:2})} บาท</span> <span style="display:inline-block;border:2px solid #16a34a;color:#16a34a;border-radius:6px;padding:2px 8px;font-weight:700;font-size:12px;margin-left:6px;transform:rotate(-6deg)">ชำระเงินแล้ว</span></td></tr></table>
<div style="background:#f1f5f9;border-radius:10px;padding:12px;margin:16px 0 0"><span style="display:inline-block;width:18px;height:18px;border-radius:50%;background:#16a34a;color:#fff;text-align:center;line-height:18px;font-size:11px;margin-right:8px">✓</span>ได้รับชำระเงินเรียบร้อยแล้ว<div style="color:#475569;margin:4px 0 0 26px;font-size:12px">วิธีชำระ: ${i.mt=='qr'?'โอนเงิน (PromptPay)':'เงินสด'}</div></div>
<table style="width:100%;border-collapse:collapse"><tr>${sg(u.name||'-','ผู้จ่ายเงิน')}${sg(pe,'ผู้รับเงิน')}</tr></table>
<div style="text-align:center;font-size:11px;color:#94a3b8;margin-top:14px">ขอบคุณที่ใช้บริการ ${e(nm)}</div></div>`}
let RCA=0,RCF='all';
function rcTable(){const all=D.inv.filter(i=>i.slip||i.s=='paid'),L=all.filter(i=>RCF=='all'||st(i)==RCF).sort((a,b)=>(b.sub||b.paid||0)-(a.sub||a.paid||0)),V=RCA?L:L.slice(0,20),
 fb=(k,t)=>`<button class="b ${RCF==k?'':'b2'} sm" onclick="RCF='${k}';RCA=0;R()">${t}</button>`;
 return`<div class="cd sc" style="margin-top:14px"><h3 style="margin-bottom:6px">สลิปโอนเงินและใบเสร็จของผู้เช่า</h3><small class="mu">สลิปที่ผู้เช่าส่งมาทุกห้อง และใบเสร็จเมื่อผู้ดูแลยืนยันการชำระแล้ว</small><div style="display:flex;gap:8px;flex-wrap:wrap;margin:10px 0">${fb('all','ทั้งหมด')}${fb('pending','รอตรวจสอบ')}${fb('paid','ชำระแล้ว')}</div><table><tr><th>ห้อง</th><th>ผู้เช่า</th><th>รอบบิล</th><th>ยอด</th><th>ช่องทาง</th><th>วันที่แจ้งชำระ</th><th>สถานะ</th><th></th></tr>${V.map(i=>{const u=tu(i)||{};return`<tr><td>${e(i.room)}</td><td>${e(u.name||'-')}</td><td>${mon(i.per)}</td><td>฿${fm(tot(i))}</td><td>${i.mt=='qr'?'QR':i.mt=='cash'?'เงินสด':'-'}</td><td>${i.sub?dt(i.sub):'-'}</td><td>${pill(i)}</td><td style="white-space:nowrap">${i.slip?`<button class="b b2 sm" onclick="vs('${i.id}')">สลิป</button> `:''}${i.s=='paid'?`<button class="b b2 sm" onclick="rc('${i.id}')">ใบเสร็จ</button>`:''}</td></tr>`}).join('')||'<tr><td colspan=8 class=mu>ยังไม่มีรายการ</td></tr>'}</table>${!RCA&&L.length>20?`<div style="margin-top:10px"><button class="b b2 sm" onclick="RCA=1;R()">ดูทั้งหมด (${L.length} รายการ)</button></div>`:''}</div>`}
function rc(id){const i=gi(id);if(i.s=='paid'&&!i.rc&&U.role!='owner'){i.rc=nrc();save()}mo(`<div id="rcimg" style="background:#fff;padding:2px;border-radius:14px">${rcpHTML(i)}</div><br><div class="np" style="display:flex;gap:8px;flex-wrap:wrap"><button class="b gr" onclick="si('${id}')">⬇ บันทึกรูปใบเสร็จ</button>${innerWidth>800?'<button class="b b2" onclick="try{window.print()}catch(x){}">พิมพ์</button>':''}<button class="b b2" onclick="cm()">ปิด</button></div>`);if(innerWidth>800)$('#mc').style.maxWidth='560px'}
async function si(id){const i=gi(id),el=$('#rcimg');if(!window.html2canvas)return alert('โหลดตัวสร้างรูปไม่สำเร็จ กรุณารีเฟรชหน้าแล้วลองใหม่');tt('กำลังสร้างรูปใบเสร็จ...');
 try{const c=await html2canvas(el,{scale:2,backgroundColor:'#ffffff'}),blob=await new Promise(r=>c.toBlob(r,'image/png')),fn='receipt-'+(i.rc||id)+'.png';let dl=null;try{dl=window.claude&&await claude.use('downloads')}catch(x){}
  if(dl){try{await dl.save({filename:fn,data:blob});tt('✓ บันทึกรูปใบเสร็จแล้ว');return}catch(x){if(x&&x.code=='declined')return}}
  try{const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=fn;a.rel='noopener';a.style.display='none';document.body.appendChild(a);a.click();setTimeout(()=>{a.remove();URL.revokeObjectURL(u)},10000);tt('✓ บันทึกรูปใบเสร็จลงเครื่องแล้ว');return}catch(x){}
  mo(`<img src="${c.toDataURL('image/png')}" style="width:100%;border-radius:10px" alt="ใบเสร็จรับเงิน"><p class="mu" style="font-size:13px">กดค้างที่รูป (มือถือ) หรือคลิกขวา (คอมพิวเตอร์) แล้วเลือกบันทึกรูปภาพ</p><button class="b b2" onclick="cm()">ปิด</button>`)}
 catch(x){alert('สร้างรูปไม่สำเร็จ: '+(x&&x.message||x))}}

pg.prof=()=>{const ad=U.role!='tenant';return`<h2>โปรไฟล์ของฉัน</h2><p class="mu">ดูและแก้ไขข้อมูลส่วนตัว</p><div class="pf" style="margin-top:14px"><div class="cd" style="text-align:center;display:grid;gap:10px;justify-items:center;align-content:start">${av(U,120)}<h3>${e(U.name)}</h3><span class="pl ${ad?'p':'g'}">${U.role=='owner'?'เจ้าของกิจการ':ad?'ผู้ดูแลระบบ':'ผู้เช่า'}</span>${ad?'':`<p class="mu" style="margin:0">${U.room?'ห้อง '+U.room:'รอผู้ดูแลจัดห้อง'}<br>เงินแรกเข้า ฿${fm(D.set.dep)}</p>`}<input type="file" id="pf" accept="image/jpeg,image/png,image/webp" hidden onchange="pa(this)"><div><button class="b" onclick="$('#pf').click()">เปลี่ยนรูปโปรไฟล์</button>${U.av?` <button class="b b2" onclick="pr()">ลบรูป</button>`:''}</div><small class="mu">JPG / PNG / WebP · ไม่เกิน 5MB · ครอปรูปได้ก่อนบันทึก</small></div>
<div style="display:grid;gap:14px"><div class="cd"><h3>การแสดงผล</h3><br><div class="bd" style="margin-bottom:16px"><b>ภาษา</b><span class="seg"><span class="${LANG=='th'?'on':''}" onclick="setPf('lang','th')">TH</span><span class="${LANG=='en'?'on':''}" onclick="setPf('lang','en')">EN</span></span></div><div class="bd"><b>${document.documentElement.dataset.theme=='dark'?'โหมดกลางคืน':'โหมดกลางวัน'}</b><div class="tsw ${document.documentElement.dataset.theme=='dark'?'on':''}" role="switch" onclick="setPf('theme','${document.documentElement.dataset.theme=='dark'?'light':'dark'}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg><i></i></div></div></div><div class="cd"><h3>ข้อมูลส่วนตัว</h3><br><label>ชื่อ - นามสกุล</label><input id="p_n" value="${e(U.name)}"><div class="row"><div><label>เบอร์โทร</label><input id="p_t" value="${e(U.tel||'')}" placeholder="08x-xxx-xxxx"></div><div><label>อีเมล</label><input id="p_e" value="${e(U.email)}"></div></div><label>เพศ</label><select id="p_g">${['','ชาย','หญิง','อื่นๆ'].map(v=>`<option value="${v}" ${U.g==v?'selected':''}>${v||'ไม่ระบุ'}</option>`).join('')}</select>${ad?'':`<label>ห้องพัก (แก้ไขได้โดยผู้ดูแล)</label><input value="${U.room||'รอผู้ดูแลจัดห้อง'}" disabled>`}<button class="b" onclick="ps()">บันทึกข้อมูล</button></div>
<div class="cd"><h3>เปลี่ยนรหัสผ่าน</h3><br><label>รหัสผ่านปัจจุบัน</label><input id="p_o" type="password"><div class="row"><div><label>รหัสผ่านใหม่ (อย่างน้อย 6 ตัว)</label><input id="p_w" type="password"></div><div><label>ยืนยันรหัสผ่านใหม่</label><input id="p_c" type="password"></div></div><button class="b b2" onclick="pc()">เปลี่ยนรหัสผ่าน</button></div></div></div>`};
let CR=null;
function pa(el){const f=el.files[0];el.value='';if(!f)return;if(!/^image\/(jpeg|png|webp)$/.test(f.type))return alert('รองรับเฉพาะไฟล์ JPG / PNG / WebP');if(f.size>5*1024*1024)return alert('ไฟล์ใหญ่เกิน 5MB กรุณาเลือกรูปที่เล็กกว่านี้');
 const rd=new FileReader;rd.onload=()=>{const m=new Image;m.onload=()=>{const z=Math.max(280/m.width,280/m.height);CR={m,s:z,min:z,x:(280-m.width*z)/2,y:(280-m.height*z)/2};
  mo(`<h3>ครอปรูปโปรไฟล์</h3><small class="mu">ลากเพื่อจัดตำแหน่ง · เลื่อนแถบเพื่อซูม</small><canvas id="cvx" width="280" height="280" style="width:100%;max-width:280px;display:block;margin:12px auto;border-radius:12px;touch-action:none;cursor:grab"></canvas><label>ซูม</label><input id="czs" type="range" min="1" max="4" step="0.01" value="1" oninput="crz(this.value)"><button class="b" onclick="crs()">ใช้รูปนี้</button> <button class="b b2" onclick="CR=null;cm()">ยกเลิก</button>`);
  const c=$('#cvx');c.onpointerdown=e=>{c.setPointerCapture(e.pointerId);CR.d=[e.clientX,e.clientY]};c.onpointermove=e=>{if(!CR||!CR.d)return;const k=280/c.getBoundingClientRect().width;CR.x+=(e.clientX-CR.d[0])*k;CR.y+=(e.clientY-CR.d[1])*k;CR.d=[e.clientX,e.clientY];crd()};c.onpointerup=c.onpointercancel=()=>{if(CR)CR.d=null};crd()};m.src=rd.result};rd.readAsDataURL(f)}
function crd(){const c=$('#cvx');if(!c||!CR)return;const x=c.getContext('2d'),m=CR.m;CR.x=Math.min(0,Math.max(280-m.width*CR.s,CR.x));CR.y=Math.min(0,Math.max(280-m.height*CR.s,CR.y));x.clearRect(0,0,280,280);x.drawImage(m,CR.x,CR.y,m.width*CR.s,m.height*CR.s);x.fillStyle='rgba(0,0,0,.58)';x.beginPath();x.rect(0,0,280,280);x.moveTo(270,140);x.arc(140,140,130,0,Math.PI*2,true);x.closePath();x.fill('evenodd');x.strokeStyle='#fff';x.lineWidth=2;x.beginPath();x.arc(140,140,130,0,Math.PI*2);x.stroke()}
function crz(v){const o=CR.s;CR.s=CR.min*v;const k=CR.s/o;CR.x=140-(140-CR.x)*k;CR.y=140-(140-CR.y)*k;crd()}
function crs(){const o=document.createElement('canvas');o.width=o.height=256;o.getContext('2d').drawImage(CR.m,(10-CR.x)/CR.s,(10-CR.y)/CR.s,260/CR.s,260/CR.s,0,0,256,256);U.av=o.toDataURL('image/jpeg',.85);CR=null;lg('เปลี่ยนรูปโปรไฟล์');save();cm();R();tt('✓ เปลี่ยนรูปโปรไฟล์แล้ว')}
function pr(){cf('ลบรูปโปรไฟล์?',()=>{delete U.av;lg('ลบรูปโปรไฟล์');save();R();tt('✓ ลบรูปแล้ว')})}
function ps(){const n=$('#p_n').value.trim(),m=$('#p_e').value.trim().toLowerCase(),t=$('#p_t').value.trim();
 if(!n||!m)return alert('กรอกชื่อและอีเมล');if(!/^\S+@\S+$/.test(m))return alert('รูปแบบอีเมลไม่ถูกต้อง');if(D.users.some(x=>x.id!=U.id&&x.email==m))return alert('อีเมลนี้ถูกใช้แล้ว');
 if(t&&!/^[0-9\-+ ]{9,15}$/.test(t))return alert('เบอร์โทรไม่ถูกต้อง');Object.assign(U,{name:n,email:m,tel:t,g:$('#p_g').value});lg('แก้ไขโปรไฟล์');save();R();tt('✓ บันทึกข้อมูลแล้ว')}
function pc(){const o=$('#p_o').value,w=$('#p_w').value;if(o!=U.pw)return alert('รหัสผ่านปัจจุบันไม่ถูกต้อง');if(w.length<6)return alert('รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัว');if(w!=$('#p_c').value)return alert('ยืนยันรหัสผ่านไม่ตรงกัน');
 U.pw=w;lg('เปลี่ยนรหัสผ่าน');save();R();alert('เปลี่ยนรหัสผ่านสำเร็จ\nครั้งต่อไปให้เข้าสู่ระบบด้วยรหัสผ่านใหม่')}

const B=n=>'฿'+Number(n).toLocaleString(LOCF(),{minimumFractionDigits:2,maximumFractionDigits:2});
function docHTML(i,k,nl){if(k=='rcp')return rcpHTML(i);const S=D.set,inv=k=='inv',c=inv?'#1d4ed8':'#16a34a',u=tu(i)||{},nm=S.name||'T&T Mansion',
 f=inv?0:(i.fine||0),T=inv?base(i):tot(i),rows=[['ค่าเช่าห้อง',i.rent],['ค่าไฟฟ้า ('+i.pv+' - '+(i.pv+i.u)+') ใช้ '+i.u+' หน่วย × '+S.rate,i.el]];
 if(i.x)rows.push([i.xn||'ค่าใช้จ่ายเพิ่มเติม',i.x]);if(f)rows.push(['ค่าปรับล่าช้า',f]);
 const H=(l,v,b)=>`<tr><td style="padding:6px 0;color:#64748b;vertical-align:top">${e(l)}</td><td style="padding:6px 0 6px 12px;text-align:right;${b?'font-weight:700;color:#0f172a':'color:#0f172a'}">${v}</td></tr>`,
 url=/^https?:\/\//.test(S.url||'')?e(S.url):'';
 return`<div class="doc" style="font-family:Tahoma,Arial,sans-serif;max-width:480px;margin:0 auto;background:#fff;color:#0f172a;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;text-align:left">
<div style="background:${c};color:#fff;text-align:center;padding:24px 16px"><div style="font-size:26px;font-weight:700">${inv?'ใบแจ้งหนี้':'ใบเสร็จรับเงิน'}</div><div>${e(nm)}</div></div>
<div style="padding:20px;font-size:14px"><table style="width:100%;border-collapse:collapse">${H('ผู้เช่า','คุณ '+e(u.name||'-')+' ห้อง '+i.room,1)}${H('เลขที่บิล',i.id,1)}${H('รอบบิล',mon(i.per),1)}${H(inv?'ครบกำหนด':'วันที่ชำระ',inv?dt(due(i)):dt(i.paid),1)}</table>
<div style="border-top:1px solid #e2e8f0;margin:12px 0"></div><div style="font-weight:700">รายละเอียด</div><table style="width:100%;border-collapse:collapse">${rows.map(r=>H(r[0],B(r[1]))).join('')}</table>
<div style="background:${inv?'#e0e7ff':'#dcfce7'};border-radius:12px;text-align:center;padding:16px;margin:16px 0"><div style="color:#64748b">${inv?'ยอดชำระทั้งสิ้น':'ยอดที่ชำระ'}</div><div style="font-size:32px;font-weight:700;color:${c}">${B(T)}</div></div>
${inv?`<div style="font-weight:700">ช่องทางการชำระเงิน</div><div style="color:#475569;margin:6px 0">ชำระผ่าน PromptPay QR ในระบบ แล้วแนบสลิปโอนเงิน${S.pp?'<br>PromptPay: <b style="color:#0f172a">'+e(S.pp)+'</b>':''}<br>หากต้องการชำระเงินสด สามารถชำระได้ที่หน้าเคาน์เตอร์</div><div style="color:#b45309;font-size:12px">ชำระหลังวันที่ ${S.due} ของเดือนถัดไป มีค่าปรับวันละ 50 บาท สูงสุด ${S.max} บาท</div>${url&&!nl?`<a href="${url}" style="display:block;background:${c};color:#fff;text-align:center;text-decoration:none;padding:12px;border-radius:10px;margin-top:14px;font-weight:700">ดูใบแจ้งหนี้ / ชำระเงิน</a>`:''}`
:`<div style="background:#f1f5f9;border-radius:10px;padding:12px;color:#166534">✓ ได้รับชำระเงินเรียบร้อยแล้ว<br><span style="color:#475569">วิธีชำระ: ${i.mt=='qr'?'โอนเงิน (PromptPay)':'เงินสด'}</span></div><div style="color:#475569;margin-top:12px">ผู้รับเงิน: ${e(S.payee||nm)}</div>`}
<div style="color:#94a3b8;font-size:12px;text-align:center;margin-top:16px">${S.addr?e(S.addr)+'<br>':''}${S.tel?'โทร '+e(S.tel)+'<br>':''}ขอบคุณที่ใช้บริการ ${e(nm)}</div></div></div>`}
const vi=id=>{const i=gi(id),can=U&&U.role=='tenant'&&i.s=='unpaid'&&mine(i),can2=U&&U.role=='tenant'&&i.s=='pending'&&i.mt!='cash'&&mine(i);mo(docHTML(i,'inv',1)+'<br><div class="np" style="display:flex;gap:8px;flex-wrap:wrap">'+(can?`<button class="b" onclick="pm('${id}')">ชำระเงิน</button>`:'')+(can2?`<button class="b" onclick="pm('${id}')">แก้ไข/ส่งสลิปใหม่</button>`:'')+'<button class="b b2" onclick="cm()">ปิด</button></div>')};
async function mail(k,i,re){const u=tu(i);if(!u)return;D.mail=D.mail||[];const S=D.set,sj=(k=='inv'?'ใบแจ้งหนี้ ':'ใบเสร็จรับเงิน ')+mon(i.per)+' ห้อง '+i.room+' - '+(S.name||'T&T Mansion');
 const m=re||{t:Date.now(),to:u.email,sj,k,inv:i.id,st:'sending'};if(!re){D.mail.unshift(m);D.mail=D.mail.slice(0,100)}m.to=u.email;
 if(!(S.ejs&&S.ejt&&S.ejk)){m.st='wait';m.er='ยังไม่ได้ตั้งค่า EmailJS ในหน้าตั้งค่า';save();if(P=='rep')R();return}
 try{const r=await fetch('https://api.emailjs.com/api/v1.0/email/send',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({service_id:S.ejs,template_id:S.ejt,user_id:S.ejk,template_params:{to_email:u.email,to_name:u.name,subject:sj,message_html:docHTML(i,k)}})});
  if(!r.ok)throw new Error(await r.text());m.st='ok';m.er='';m.t=Date.now()}catch(x){m.st='fail';m.er=String(x.message||x).slice(0,120)}
 save();if(P=='rep')R()}
function pv(x){const m=D.mail[x],i=gi(m.inv);mo(`<small class="mu">ถึง ${e(m.to)}<br>เรื่อง ${e(m.sj)}</small><br><br>${docHTML(i,m.k)}<br><button class="b b2" onclick="cm()">ปิด</button>`)}
function rs2(x){const m=D.mail[x];m.st='sending';R();mail(m.k,gi(m.inv),m)}
pg.con=()=>{const ad=U.role=='admin',t=D.users.filter(u=>u.role=='tenant'&&u.room&&(U.role!='tenant'||u.id==U.id)).sort((a,b)=>!!a.out-!!b.out||a.room-b.room);
return`<h2>สัญญาเช่า</h2><input type="file" id="cpi" accept="application/pdf" hidden onchange="cpf(this)"><p class="mu">เงินแรกเข้า ฿${fm(D.set.dep)} (มัดจำ + ค่าเช่าล่วงหน้า) บันทึกครั้งเดียว ณ วันเริ่มสัญญา</p><div class="cd sc" style="margin-top:14px"><table><tr><th>ห้อง</th><th>ผู้เช่า</th><th>เริ่มสัญญา</th><th>สิ้นสุด</th><th>เงินแรกเข้า</th><th>สถานะ</th><th>ไฟล์สัญญา (PDF)</th>${ad?'<th></th>':''}</tr>${t.map(u=>`<tr><td>${u.room}</td><td>${e(u.name)}</td><td>${dt(u.cs||u.id)}</td><td>${u.ce?dt(u.ce):'ไม่กำหนด'}</td><td>฿${fm(D.set.dep)}</td><td>${u.out?'<span class="pl r">สิ้นสุดสัญญา</span>':'<span class="pl g">มีผลบังคับใช้</span>'}</td><td>${pdfc(u.room,ad)}</td>${ad?`<td><button class="b b2 sm" onclick="ec(${u.id})">แก้ไขวันที่</button></td>`:''}</tr>`).join('')||'<tr><td colspan=8 class=mu>ไม่มีข้อมูล</td></tr>'}</table></div>`};
const iv=ts=>ts?new Date(ts-new Date(ts).getTimezoneOffset()*6e4).toISOString().slice(0,10):'';
function ec(id){const u=D.users.find(x=>x.id==id);mo(`<h3>สัญญาเช่า ห้อง ${u.room}</h3><label>วันเริ่มสัญญา</label><input id="c_s" type="date" value="${iv(u.cs||u.id)}"><label>วันสิ้นสุดสัญญา (เว้นว่างได้)</label><input id="c_e" type="date" value="${iv(u.ce)}"><button class="b" onclick="sc2(${id})">บันทึก</button> <button class="b b2" onclick="cm()">ยกเลิก</button>`)}
function sc2(id){const u=D.users.find(x=>x.id==id),a=$('#c_s').value,b=$('#c_e').value;if(!a)return alert('ระบุวันเริ่มสัญญา');if(b&&b<a)return alert('วันสิ้นสุดต้องไม่ก่อนวันเริ่มสัญญา');u.cs=new Date(a).getTime();if(b)u.ce=new Date(b).getTime();else delete u.ce;lg('แก้ไขสัญญา ห้อง '+u.room);save();cm();R();tt('✓ บันทึกสัญญาแล้ว')}
function th(id){const u=D.users.find(x=>x.id==id),l=D.inv.filter(i=>i.uid?i.uid==id:i.room==u.room).sort((a,b)=>b.per.localeCompare(a.per));mo(`<h3>ประวัติชำระ ${e(u.name)}</h3><small class="mu">ห้อง ${u.room}</small><div class="sc"><table><tr><th>รอบบิล</th><th>ยอด</th><th>สถานะ</th><th>วันที่ชำระ</th></tr>${l.map(i=>`<tr><td>${mon(i.per)}</td><td>฿${fm(tot(i))}</td><td>${pill(i)}</td><td>${i.paid?dt(i.paid):'-'}</td></tr>`).join('')||'<tr><td colspan=4 class=mu>ยังไม่มีบิล</td></tr>'}</table></div><br><button class="b b2" onclick="cm()">ปิด</button>`)}
async function xc(){const h=['เลขที่บิล','ห้อง','ผู้เช่า','รอบบิล','ค่าเช่า','ค่าไฟ','อื่นๆ','ค่าปรับ','ยอดสุทธิ','สถานะ','วิธีชำระ'],q=v=>'"'+String(v??'').replace(/"/g,'""')+'"',rows=D.inv.map(i=>[i.id,i.room,(tu(i)||{}).name,i.per,i.rent,i.el,i.x||0,tot(i)-base(i),tot(i),SL[st(i)][0],i.mt||'']),txt='\ufeff'+[h,...rows].map(x=>x.map(q).join(',')).join('\n'),blob=new Blob([txt],{type:'text/csv;charset=utf-8'});let dl=null;try{dl=window.claude&&await claude.use('downloads')}catch(x){}
if(dl){try{await dl.save({filename:'ttm-report.csv',data:blob});tt('✓ ส่งออกแล้ว');return}catch(x){if(x&&x.code=='declined')return}}
const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='ttm-report.csv';a.click()}
function cwh(ev){const w=ev.target.closest&&ev.target.closest('.cw');document.querySelectorAll('.cw.on').forEach(x=>{if(x!==w){x.classList.remove('on');x.querySelector('.tp').style.display='none';x.querySelectorAll('.hv,.hd').forEach(n=>n.setAttribute('opacity',0))}});if(!w)return;
 const sv=w.querySelector('svg'),r=sv.getBoundingClientRect(),v=JSON.parse(w.dataset.v),l=JSON.parse(w.dataset.l),n=v.length,mx=Math.max(...v,1),px=(ev.clientX-r.left)/r.width*600,X=i=>70+520*(n>1?i/(n-1):.5);
 let k=0,bd=1e9;for(let i=0;i<n;i++){const d=Math.abs(X(i)-px);if(d<bd){bd=d;k=i}}
 const cx=X(k),cy=8+166*(1-v[k]/mx),hv=w.querySelector('.hv'),hd=w.querySelector('.hd'),tp=w.querySelector('.tp');
 hv.setAttribute('x1',cx);hv.setAttribute('x2',cx);hv.setAttribute('opacity',1);hd.setAttribute('cx',cx);hd.setAttribute('cy',cy);hd.setAttribute('opacity',1);
 tp.innerHTML=`<b>${l[k]}</b><div><i style="background:${w.dataset.c}"></i>${w.dataset.n} <b>฿${fm(v[k])}</b></div>`;tp.style.display='block';w.classList.add('on');
 const tw=tp.offsetWidth,lx=cx/600*r.width;tp.style.left=Math.max(0,Math.min(r.width-tw,lx-tw/2))+'px';tp.style.top=Math.max(0,cy/200*r.height-tp.offsetHeight-14)+'px'}
['pointermove','pointerdown'].forEach(t=>document.addEventListener(t,cwh));document.addEventListener('mouseout',ev=>{if(!ev.relatedTarget)cwh({target:document.body})});
let LQ='',TKI=[];
const okImg=f=>/^image\/(jpeg|png|webp)$/.test(f.type)&&f.size<=5*1024*1024,
rz=(f,max,type,q,cb)=>{const rd=new FileReader;rd.onload=()=>{const m=new Image;m.onload=()=>{const k=Math.min(1,max/Math.max(m.width,m.height)),c=document.createElement('canvas');c.width=m.width*k;c.height=m.height*k;c.getContext('2d').drawImage(m,0,0,c.width,c.height);cb(c.toDataURL(type,q))};m.src=rd.result};rd.readAsDataURL(f)},
TKS={open:['รอดำเนินการ','y'],prog:['กำลังดำเนินการ','p'],done:['เสร็จสิ้น','g']};
pg.help=()=>{TKI=[];const S=D.set,ad=U.role=='admin',tk=(D.tk=D.tk||[]).filter(t=>ad||t.uid==U.id).sort((a,b)=>b.t-a.t),id=(S.line||'').trim();
 return`<div class="hd2"><i class="ci" style="width:44px;height:44px;font-size:20px">◍</i><div><h2>ศูนย์ช่วยเหลือ</h2><p class="mu" style="margin:2px 0">ส่งคำขอ — เราจะตอบกลับโดยเร็วที่สุด</p></div></div>
<div style="max-width:780px"><h3 style="margin:18px 0 4px">ช่องทางการติดต่อ</h3><p class="mu" style="margin:0 0 12px">ติดต่อเราผ่านช่องทางที่คุณสะดวก</p>
<div class="ln2"><b>💬 LINE Official Account</b><div class="lnb"><div class="lq">${S.lineqr?`<img src="${S.lineqr}" alt="QR LINE">`:'พื้นที่ใส่ QR LINE<br>'+(ad?'(กดแก้ไขเพื่อเพิ่ม)':'(ผู้ดูแลยังไม่ได้เพิ่ม)')}</div><div style="flex:1;min-width:200px"><h3 style="color:#06c755;font-size:22px">${id?e(id):'ยังไม่ได้ตั้งค่า LINE ID'}</h3><small class="mu">LINE Official Account · ${PN()}</small><p class="mu" style="font-size:12px;margin:8px 0">สแกน QR หรือค้นหา LINE ID เพื่อเพิ่มเพื่อน</p>${id?`<a class="b lgb" style="display:inline-block;text-decoration:none" target="_blank" rel="noopener" href="https://line.me/R/ti/p/${encodeURIComponent(id)}">เพิ่มเพื่อนใน LINE</a>`:''} ${ad?'<button class="b b2 sm" onclick="le()">แก้ไข QR / LINE ID</button>':''}</div></div></div>
${ad?'':contactCard()}${ad?'':`<h3 style="margin:28px 0 12px">ส่งคำขอใหม่</h3><div class="cd"><label>หมวดหมู่</label><select id="tkc"><option value="">เลือกหมวดหมู่</option>${['ปัญหาการชำระเงิน','ใบแจ้งหนี้ / ค่าไฟ','ซ่อมบำรุง','บัญชีผู้ใช้','อื่นๆ'].map(x=>`<option>${x}</option>`).join('')}</select><label>หัวข้อ</label><input id="tkt" placeholder="อธิบายปัญหาโดยย่อ" maxlength="100"><label>รายละเอียด</label><textarea id="tkb" rows="4" placeholder="กรุณาอธิบายปัญหาอย่างละเอียด..."></textarea><label>แนบรูปภาพ (ไม่บังคับ)</label><div style="margin:6px 0"><input type="file" id="tkf" accept="image/jpeg,image/png,image/webp" multiple hidden onchange="tki(this)"><button class="b b2 sm" onclick="$('#tkf').click()">🖼 แนบรูปภาพ</button> <small class="mu">สูงสุด 5 รูป (JPEG, PNG, WebP) · ไม่เกิน 5MB ต่อรูป</small></div><div id="tkp" class="fl"></div><div style="text-align:right"><button class="b" onclick="tks()">✈ ส่งคำขอ</button></div></div>`}
<h3 style="margin:28px 0 12px">${ad?'คำขอจากผู้ใช้ (ช่วยเหลือผู้ส่งคำขอ)':'คำขอของฉัน'}</h3>${tk.map(t=>`<div class="cd" style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><div><b>${e(t.title)}</b> <span class="rch">${e(t.cat)}</span><br><small class="mu">${e(t.name)}${t.room?' · ห้อง '+t.room:''} · ${dt(t.t)}</small></div>${ad?`<select style="width:auto;margin:0" onchange="tkst('${t.id}',this.value)">${Object.entries(TKS).map(([k,v])=>`<option value="${k}" ${t.s==k?'selected':''}>${v[0]}</option>`).join('')}</select>`:`<span class="pl ${TKS[t.s][1]}">${TKS[t.s][0]}</span>`}</div><p style="white-space:pre-line;margin:10px 0">${e(t.body)}</p>${(t.imgs||[]).map((x,i)=>`<img class="tmb" src="${x}" onclick="tkv('${t.id}',${i})"> `).join('')}${t.reply?`<div class="note" style="margin-top:10px">💬 ตอบกลับจากผู้ดูแลระบบ${t.rby?' ('+e(t.rby)+')':''}<br>${e(t.reply)}</div>`:''}${ad?`<textarea id="rp_${t.id}" rows="2" placeholder="พิมพ์ข้อความตอบกลับ…" style="margin-top:10px">${e(t.reply||'')}</textarea><div style="text-align:right"><button class="b sm" onclick="tkrp('${t.id}')">ส่งคำตอบ</button></div>`:''}</div>`).join('')||'<div class="cd mu" style="text-align:center">ยังไม่มีคำขอ</div>'}</div>`};
function tkr(){$('#tkp').innerHTML=TKI.map((x,i)=>`<span style="position:relative"><img class="tmb" src="${x}"><b onclick="TKI.splice(${i},1);tkr()" style="position:absolute;top:-6px;right:-6px;background:#dc2626;color:#fff;border-radius:50%;width:18px;height:18px;text-align:center;font-size:12px;cursor:pointer;line-height:18px">×</b></span>`).join('')}
function tki(el){[...el.files].forEach(f=>{if(TKI.length>=5)return alert('แนบได้สูงสุด 5 รูป');if(!okImg(f))return alert('รองรับ JPEG / PNG / WebP ไม่เกิน 5MB ต่อรูป');rz(f,640,'image/jpeg',.6,u=>{if(TKI.length<5){TKI.push(u);tkr()}})});el.value=''}
function tks(){const c=$('#tkc').value,t=$('#tkt').value.trim(),b=$('#tkb').value.trim();if(!c||!t||!b)return alert('กรอกหมวดหมู่ หัวข้อ และรายละเอียดให้ครบ');
 D.tk.unshift({id:'TK'+Date.now(),uid:U.id,name:U.name,room:U.room||null,cat:c,title:t,body:b,imgs:TKI.slice(),t:Date.now(),s:'open'});lg('ส่งคำขอช่วยเหลือ: '+t);save();R();tt('✓ ส่งคำขอแล้ว เราจะตอบกลับโดยเร็วที่สุด')}
function tkst(id,v){const t=D.tk.find(x=>x.id==id);t.s=v;lg('เปลี่ยนสถานะคำขอ '+t.title);save();R();tt('✓ อัปเดตสถานะแล้ว')}
function tkv(id,i){mo(`<img src="${D.tk.find(x=>x.id==id).imgs[i]}" style="width:100%;border-radius:12px"><br><br><button class="b b2" onclick="cm()">ปิด</button>`)}
function le(){const S=D.set;LQ=S.lineqr||'';mo(`<h3>LINE Official Account</h3><label>LINE ID (เช่น @ttmansion)</label><input id="l_id" value="${e(S.line||'')}" placeholder="@yourid"><label>รูป QR Code LINE</label><div class="lq" style="margin:6px 0 10px" id="l_pv">${S.lineqr?`<img src="${S.lineqr}">`:'ยังไม่มีรูป'}</div><input type="file" id="l_f" accept="image/jpeg,image/png,image/webp" hidden onchange="lqf(this)"><button class="b b2 sm" onclick="$('#l_f').click()">เลือกรูป QR</button> <button class="b b2 sm" onclick="LQ='';$('#l_pv').textContent='ลบรูปแล้ว'">ลบรูป</button><br><br><button class="b" onclick="ls()">บันทึก</button> <button class="b b2" onclick="cm()">ยกเลิก</button>`)}
function lqf(el){const f=el.files[0];el.value='';if(!f)return;if(!okImg(f))return alert('รองรับ JPEG / PNG / WebP ไม่เกิน 5MB');rz(f,480,'image/png',1,u=>{LQ=u;$('#l_pv').innerHTML=`<img src="${u}">`})}
function ls(){D.set.line=$('#l_id').value.trim();if(LQ)D.set.lineqr=LQ;else delete D.set.lineqr;lg('แก้ไขช่องทาง LINE');save();cm();R();tt('✓ บันทึกแล้ว')}
pg.news=()=>{const ad=U.role=='admin',n=(D.news=D.news||[]).slice().sort((a,b)=>b.t-a.t);
 return`<div class="hd2"><i class="ci" style="width:44px;height:44px;font-size:20px">▣</i><div style="flex:1"><h2>ข่าวสาร</h2><p class="mu" style="margin:2px 0">ประกาศและข่าวสารจาก ${PN()}</p></div>${ad?'<button class="b" onclick="nw()">+ ประกาศข่าว</button>':''}<button class="b b2 sm np" onclick="R()" title="รีเฟรช">⟳</button></div><div style="max-width:780px">${n.map(x=>`<div class="cd" style="margin-bottom:12px"><div class="ch"><b style="font-size:17px">${e(x.title)}</b>${ad?`<button class="b b2 sm" onclick="nd('${x.id}')">ลบ</button>`:''}</div><small class="mu">${dt(x.t)} · ${e(x.by||'')}</small><p style="white-space:pre-line;margin:10px 0 0">${e(x.body)}</p></div>`).join('')||`<div class="mu" style="text-align:center;padding:70px 0"><div class="ci" style="width:56px;height:56px;margin:0 auto 12px;font-size:24px;border-radius:50%">▣</div>ยังไม่มีข่าวสาร</div>`}</div>`};
function nw(){mo(`<h3>ประกาศข่าว</h3><label>หัวข้อ</label><input id="n_t" maxlength="100"><label>รายละเอียด</label><textarea id="n_b" rows="5"></textarea><button class="b" onclick="ns()">ประกาศ</button> <button class="b b2" onclick="cm()">ยกเลิก</button>`)}
function ns(){const t=$('#n_t').value.trim(),b=$('#n_b').value.trim();if(!t||!b)return alert('กรอกหัวข้อและรายละเอียด');D.news.unshift({id:'N'+Date.now(),t:Date.now(),title:t,body:b,by:U.name});lg('ประกาศข่าว: '+t);save();cm();R();tt('✓ ประกาศข่าวแล้ว')}
function nd(id){cf('ลบข่าวนี้?',()=>{D.news=D.news.filter(x=>x.id!=id);lg('ลบข่าว');save();R()})}
const NVA=[['dash','แดชบอร์ด','▦'],['rooms','ห้องพัก','⌂'],['ten','ผู้เช่า',PI],['con','สัญญาเช่า','▥'],['met','มิเตอร์ & ออกบิล','◔'],['pay','รับชำระเงิน','▤'],['rep','รายงาน','☰'],['set','ตั้งค่า','⚙'],['help','ช่วยเหลือ','◍'],['news','ข่าวสาร','▣'],['prof','โปรไฟล์','◉']];
let CPR=0;
const pdfc=(n,ad)=>{const r=D.rooms.find(x=>x.n==n),f=r&&r.pdf;return f?`<button class="b b2 sm" style="border:1px solid var(--ac);color:var(--ac);max-width:100%;text-align:left" title="${e(f.name)}" onclick="cpv(${n})">📄 ${e(f.name.length>24?f.name.slice(0,22)+'…':f.name)}</button><br><small class="mu">${Math.round(f.size/1024)} KB</small>${ad?` <button class="b b2 sm" onclick="CPR=${n};$('#cpi').click()">เปลี่ยน</button> <button class="b b2 sm" onclick="cpd(${n})">ลบ</button>`:''}`:(ad?`<button class="b b2 sm" onclick="CPR=${n};$('#cpi').click()">อัปโหลด PDF</button>`:'<small class="mu">ยังไม่มีไฟล์</small>')};
function cpf(el){const f=el.files[0];el.value='';if(!f)return;if(f.type!='application/pdf'&&!/\.pdf$/i.test(f.name))return alert('รองรับเฉพาะไฟล์ PDF');if(f.size>2*1024*1024)return alert('ไฟล์ใหญ่เกิน 2MB (พื้นที่จัดเก็บของเบราว์เซอร์จำกัด)');
 const rd=new FileReader;rd.onload=()=>{const r=D.rooms.find(x=>x.n==CPR);if(!r)return;const old=r.pdf;r.pdf={name:f.name,size:f.size,data:rd.result,t:Date.now()};try{localStorage.setItem(K,JSON.stringify(D))}catch(x){if(old)r.pdf=old;else delete r.pdf;return alert('พื้นที่จัดเก็บเต็ม ไม่สามารถเก็บไฟล์นี้ได้')}lg('อัปโหลดไฟล์สัญญา ห้อง '+CPR);R();tt('✓ อัปโหลดไฟล์สัญญา ห้อง '+CPR+' แล้ว')};rd.readAsDataURL(f)}
function cpd(n){cf('ลบไฟล์สัญญาห้อง '+n+'?',()=>{delete D.rooms.find(x=>x.n==n).pdf;lg('ลบไฟล์สัญญา ห้อง '+n);save();R()})}
function cpv(n){const r=D.rooms.find(x=>x.n==n);if(!r||!r.pdf)return;const b=atob(r.pdf.data.split(',')[1]),a=new Uint8Array(b.length);for(let i=0;i<b.length;i++)a[i]=b.charCodeAt(i);const u=URL.createObjectURL(new Blob([a],{type:'application/pdf'}));mo(`<h3>สัญญาเช่า ห้อง ${n}</h3><small class="mu">${e(r.pdf.name)}</small><iframe src="${u}" style="width:100%;height:62vh;border:1px solid var(--ln);border-radius:12px;margin:10px 0"></iframe><a class="b b2" target="_blank" rel="noopener" href="${u}">เปิดในแท็บใหม่</a> <button class="b b2" onclick="cm()">ปิด</button>`);$('#mc').style.maxWidth='860px'}
const UN=()=>D.users.filter(u=>u.role=='tenant'&&!u.room&&!u.out);
function asg(uid,n){const u=D.users.find(x=>x.id==uid),r=D.rooms.find(x=>x.n==n);if(!u||!r)return;if(!vac(r))return alert('ห้องนี้ไม่ว่างแล้ว');u.room=n;u.cs=Date.now();lg('จัดห้อง '+n+' ให้ '+u.name);save();cm();R();tt('✓ จัดห้อง '+n+' ให้ '+u.name+' แล้ว')}
function asr(uid){const u=D.users.find(x=>x.id==uid),f=D.rooms.filter(vac);if(!f.length)return alert('ไม่มีห้องว่างสำหรับเพิ่มผู้เช่า');mo(`<h3>จัดห้องให้ ${e(u.name)}</h3><small class="mu">${e(u.tel||u.email)}</small><label>เลือกห้องว่าง</label><select id="as_r">${f.map(r=>`<option>${r.n}</option>`).join('')}</select><button class="b" onclick="asg(${uid},+$('#as_r').value)">จัดห้อง</button> <button class="b b2" onclick="cm()">ยกเลิก</button>`)}
const contactsOf=()=>{const L=(D.contacts&&D.contacts.length)?D.contacts:D.users.filter(u=>u.role=='admin'||u.role=='owner').map(u=>({role:u.role,name:u.name,phone:u.tel}));const f=x=>L.find(y=>y.role==x)||{};return{owner:f('owner'),admin:f('admin')}};
function contactCard(){const C=contactsOf(),rows=U.role=='tenant'?[['เจ้าของกิจการ',C.owner],['ผู้ดูแลระบบ',C.admin]]:[['ผู้ดูแลระบบ',C.admin]];
 return`<h3 style="margin:28px 0 12px">เบอร์โทรติดต่อ</h3><div class="cd">${rows.map((x,i)=>`<div class="bd" style="padding:10px 0;align-items:center;${i?'border-top:1px solid var(--ln)':''}"><span><b>${i+1}. ${x[0]}</b><br><small class="mu">${e(x[1].name||'')}</small></span>${x[1].phone?`<a class="b sm" style="text-decoration:none" href="tel:${e(x[1].phone)}">โทร ${e(x[1].phone)}</a>`:'<small class="mu">ยังไม่ได้ตั้งค่าเบอร์โทร</small>'}</div>`).join('')}</div>`}
function tkrp(id){const t=D.tk.find(x=>x.id==id),v=$('#rp_'+id).value.trim();if(!v)return alert('พิมพ์ข้อความตอบกลับ');t.reply=v;t.rby=U.name;t.rt=Date.now();if(t.s=='open')t.s='prog';lg('ตอบคำขอ '+t.title);save();R();tt('✓ ส่งคำตอบแล้ว')}
// ---- shell ----
function R(){const o=document.querySelector('.sb'),l=o?o.scrollLeft:0;if(P=='met')document.querySelectorAll('#app input[id^=m],#app input[id^=x]').forEach(i=>{if(/^(m|x|xn)\d+$/.test(i.id))MV[PER+i.id]=i.value});R0();mbl();if(P=='met')Object.keys(MV).forEach(k=>{if(k.startsWith(PER)){const i=document.getElementById(k.slice(PER.length));if(i&&i.value===''&&MV[k]!==''){i.value=MV[k];const n=+k.slice(PER.length).replace(/^\D+/,'');if(n&&document.getElementById('u'+n))lv(n)}}});const n=document.querySelector('.sb');if(n){n.scrollLeft=l;const t=n.querySelector('.nv.on');if(t){const A=n.getBoundingClientRect(),B=t.getBoundingClientRect();if(B.left<A.left+8)n.scrollLeft-=A.left+8-B.left;else if(B.right>A.right-8)n.scrollLeft+=B.right-(A.right-8)}}}
function R0(){const a=$('#app');if(!U){if(!['home','login','forgot','recover'].includes(P))P='home';a.innerHTML={home,login,reg,forgot,recover}[P]();if(P=='home')lp();a.onpointermove=e=>{a.style.setProperty('--mx',(e.clientX/innerWidth*2-1).toFixed(3));a.style.setProperty('--my',(e.clientY/innerHeight*2-1).toFixed(3))};return}
 a.onpointermove=null;a.style.removeProperty('--mx');a.style.removeProperty('--my');
 const ad=U.role=='admin',ow=U.role=='owner',nv=ow?[['dash','แดชบอร์ด','▦'],['rooms','ห้องพัก','⌂'],['con','สัญญาเช่า','▥'],['rep','รายงาน','☰'],['help','ช่วยเหลือ','◍'],['news','ข่าวสาร','▣'],['prof','โปรไฟล์','◉']]:ad?NVA:[['my','ใบแจ้งหนี้ของฉัน','▤'],['hist','ประวัติ & ใบเสร็จ','☰'],['con','สัญญาเช่า','▥'],['help','ช่วยเหลือ','◍'],['news','ข่าวสาร','▣'],['prof','โปรไฟล์','◉']];
 if(!nv.some(n=>n[0]==P))P=nv[0][0];
 a.innerHTML=`<div class="app"><div class="sb np"><div class="logo" style="margin-bottom:14px"><img class="lgi" src="${LG}" alt=""><div>T&T MANSION<br><small class="ac">PAYMENT SYSTEM</small></div></div>${nv.map(n=>`<div class="nv ${P==n[0]?'on':''}" onclick="go('${n[0]}')"><i>${n[2]}</i><span>${n[1]}</span></div>`).join('')}</div><div class="mn${ow?' ro':''}"><div class="top np">${ad?`<input placeholder="ค้นหาห้อง ผู้เช่า หรือเลขที่บิล (กด Enter)" value="${e(Q)}" onkeydown="if(event.key=='Enter'){Q=this.value;F='all';go('pay')}">`:'<span style="flex:1"></span>'}<span class="me" onclick="go('prof')">${av(U,36)}<b>${e(U.name)}</b></span><span class="seg"><span class="${LANG=='th'?'on':''}" onclick="setPf('lang','th')">TH</span><span class="${LANG=='en'?'on':''}" onclick="setPf('lang','en')">EN</span></span><button class="b b2 sm" onclick="out()">ออกจากระบบ</button></div>${pg[P]()}<p class="mu np" style="text-align:center;font-size:11px;margin:28px 0 0">เวอร์ชันระบบ ${APP_V}</p></div></div>`}
// ===================== Supabase mode (ใช้เมื่อกรอก URL + anon key ที่ด้านบนไฟล์) =====================
const SBX={cl:null,snap:{},q:Promise.resolve(),t:null,rt:null,ch:null,uid:null,recov:false},
NEWID=()=>(window.crypto&&crypto.randomUUID)?crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0;return(c=='x'?r:(r&3|8)).toString(16)}),ISO=t=>t?new Date(t).toISOString():null,tsv=v=>v?new Date(v).getTime():undefined,
DD=t=>t?new Date(t-new Date(t).getTimezoneOffset()*6e4).toISOString().slice(0,10):null,
D2T=s=>s?new Date(s+'T00:00:00').getTime():undefined,
pubUrl=(b,p)=>p?SBX.cl.storage.from(b).getPublicUrl(p).data.publicUrl:undefined,
d2b=u=>{const[h,b]=u.split(','),m=h.match(/:(.*?);/)[1],s=atob(b),a=new Uint8Array(s.length);for(let i=0;i<s.length;i++)a[i]=s.charCodeAt(i);return new Blob([a],{type:m})},
SB_ORD=['app_settings','rooms','users','tenants','contracts','meter_readings','invoices','invoice_items','payments','support_tickets','news'];
const forgotSB=()=>auth('ลืมรหัสผ่าน','กรอกอีเมลที่ลงทะเบียนไว้ ระบบจะส่งลิงก์ตั้งรหัสผ่านใหม่ให้ทางอีเมล',`<div class="ah"><span class="ib">🔑</span><div><h2>ลืมรหัสผ่าน</h2><small class="mu">ส่งลิงก์รีเซ็ตทางอีเมล</small></div><b class="ac bk" onclick="go('login')">‹ กลับ</b></div>${fld('em','อีเมล','✉','email')}<button class="b go" style="width:100%" onclick="fp()">ส่งลิงก์ตั้งรหัสผ่านใหม่ →</button>`,'จำรหัสผ่านได้แล้ว?','เข้าสู่ระบบ','login'),
recover=()=>auth('ตั้งรหัสผ่านใหม่','กรอกรหัสผ่านใหม่ของคุณ',`<div class="ah"><span class="ib">🔑</span><div><h2>ตั้งรหัสผ่านใหม่</h2><small class="mu">จากลิงก์ในอีเมล</small></div></div>${fld('pw','รหัสผ่านใหม่ (อย่างน้อย 6 ตัว)','🔑','password')}${fld('pw2','ยืนยันรหัสผ่านใหม่','🔑','password')}<button class="b go" style="width:100%" onclick="rp()">บันทึกรหัสผ่านใหม่ →</button>`,'ยกเลิก?','เข้าสู่ระบบ','login');

async function sbInit(){
 await new Promise((ok,no)=>{if(window.supabase)return ok();const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js';s.onload=ok;s.onerror=()=>no(new Error('โหลดไลบรารี supabase-js ไม่สำเร็จ'));document.head.appendChild(s)});
 SBX.cl=supabase.createClient(SB_CFG.url,SB_CFG.key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
 SBX.cl.auth.onAuthStateChange(ev=>{if(ev=='PASSWORD_RECOVERY'){SBX.recov=true;P='recover';R()}});
}
async function sbBoot(){
 await sbInit();pubLoad(true);const{data:{session}}=await SBX.cl.auth.getSession();
 if(session&&!SBX.recov){try{await sbEnter()}catch(x){alert(x.message||x)}}
}
async function sbEnter(fresh){
 await sbLoad();U=D.users.find(u=>u._uid==SBX.uid)||null;
 if(!U){await SBX.cl.auth.signOut();return alert('ไม่พบข้อมูลบัญชีในระบบ')}
 if(U.out){await SBX.cl.auth.signOut();U=null;sbReset();return alert('บัญชีนี้ย้ายออกแล้ว กรุณาติดต่อผู้ดูแล')}
 sbRT();enter(U,0,fresh);
}
function sbReset(){const d=seed();Object.assign(D,d,{users:[],log:[],inv:[],mail:[],tk:[],news:[],contacts:[]});SBX.snap={};SBX.uid=null;if(SBX.ch&&SBX.cl){SBX.cl.removeChannel(SBX.ch)}SBX.ch=null}

// ---------- โหลดข้อมูลจากฐานข้อมูลมาเป็นโครงสร้างที่หน้าเว็บใช้ (RLS กรองให้ตามบทบาท) ----------
async function sbLoad(){
 const c=SBX.cl;if(U)await sbFlush();
 const au=(await c.auth.getUser()).data.user;if(!au)throw new Error('ยังไม่ได้เข้าสู่ระบบ');SBX.uid=au.id;
 const q=async(t,f)=>{const r=await f(c.from(t).select('*'));if(r.error)throw r.error;return r.data||[]};
 const me=(await q('users',x=>x.eq('id',au.id)))[0];if(!me)throw new Error('ไม่พบข้อมูลบัญชีในระบบ');
 const ad=me.role=='admin',stf=me.role!='tenant';
 const[st,us,tn_,rm_,ct,mr,iv,it,pm_,tk,nw,lgs,ml]=await Promise.all([
  q('app_settings',x=>x),q('users',x=>x),q('tenants',x=>x),q('rooms',x=>x.order('room_no')),q('contracts',x=>x),q('meter_readings',x=>x),
  q('invoices',x=>x.order('billing_month',{ascending:false})),q('invoice_items',x=>x),q('payments',x=>x),
  q('support_tickets',x=>x.order('created_at',{ascending:false})),q('news',x=>x.order('created_at',{ascending:false})),
  stf?q('audit_logs',x=>x.order('created_at',{ascending:false}).limit(50)):[],ad?q('email_queue',x=>x.order('created_at',{ascending:false}).limit(100)):[]]);
 const S=st[0]||{},rn=id=>{const r=rm_.find(x=>x.id==id);return r?+r.room_no:null};
 D.set={rent:+S.rent_rate||0,rate:+S.electricity_rate||0,dep:+S.default_deposit||0,due:+S.due_day||5,max:+S.max_fine||0,fpd:+S.fine_per_day||50,pp:S.promptpay_id||'',name:S.dorm_name||'',addr:S.address||'',tel:S.phone||'',tax:S.tax_id||'',payee:S.payee_name||'',url:S.system_url||'',line:S.line_id||'',_id:S.id};
 D.set._lqp=S.line_qr_path||undefined;if(S.line_qr_path)D.set.lineqr=pubUrl('branding',S.line_qr_path)+'?v='+(tsv(S.updated_at)||0);
 D.rooms=rm_.map(r=>({n:+r.room_no,m:+r.current_meter,st:r.occupancy_status=='free'?undefined:r.occupancy_status,pdf:r.contract_pdf_path?{name:r.contract_pdf_name,size:r.contract_pdf_size||0,path:r.contract_pdf_path}:undefined,_id:r.id}));
 const avU=u=>u.avatar_path?pubUrl('avatars',u.avatar_path):undefined,L=[];
 us.filter(u=>u.role!='tenant').forEach(u=>L.push({id:+u.app_id,name:u.full_name||u.email,email:u.email,role:u.role,tel:u.phone||'',g:u.gender||'',av:avU(u),_avp:u.avatar_path,pf:{lang:u.lang||'th'},_uid:u.id}));
 tn_.forEach(t=>{const u=us.find(x=>x.id==t.user_id)||{},c0=ct.filter(x=>x.tenant_id==t.id).sort((a,b)=>(a.status=='active'?0:1)-(b.status=='active'?0:1)||String(b.created_at).localeCompare(String(a.created_at)))[0];
  const o={id:+t.app_id,name:t.full_name,email:t.email||u.email||'',role:'tenant',tel:t.phone||'',g:t.gender||'',av:avU(u),_avp:u.avatar_path,pf:{lang:u.lang||'th'},cs:tsv(t.created_at),_uid:t.user_id,_tid:t.id,room:null};
  if(c0){o.room=rn(c0.room_id);o.cs=D2T(c0.start_date);if(c0.end_date)o.ce=D2T(c0.end_date);if(c0.status=='ended')o.out=tsv(c0.moved_out_at)||Date.now();o._cid=c0.id;o._crm=o.room}
  L.push(o)});
 D.users=L;
 const itBy={},pmBy={};it.forEach(x=>(itBy[x.invoice_id]=itBy[x.invoice_id]||[]).push(x));pm_.forEach(x=>(pmBy[x.invoice_id]=pmBy[x.invoice_id]||[]).push(x));
 D.inv=iv.map(v=>{const its=itBy[v.id]||[],g=t=>its.find(x=>x.item_type==t),m=mr.find(x=>x.id==(g('electricity')||{}).meter_reading_id)||{},c0=ct.find(x=>x.id==v.contract_id)||{},tn0=tn_.find(x=>x.id==c0.tenant_id)||{},
   p=(pmBy[v.id]||[]).filter(x=>x.verify_status!='rejected').sort((a,b)=>String(b.submitted_at).localeCompare(String(a.submitted_at)))[0];
  const i={id:v.code,room:rn(c0.room_id),uid:tn0.app_id==null?undefined:+tn0.app_id,per:v.billing_month,pv:+m.previous_reading||0,u:+m.units_used||0,el:+(g('electricity')||{}).amount||0,x:+(g('other')||{}).amount||0,xn:(g('other')||{}).description||'',rent:+(g('rent')||{}).amount||0,fine:+(g('fine')||{}).amount||0,s:v.status=='overdue'?'unpaid':v.status,iss:tsv(v.created_at),_id:v.id,_cid:v.contract_id,_mid:m.id};
  if(p){i.mt=p.payment_method;i.sub=tsv(p.submitted_at);if(p.slip_url)i.slip=p.slip_url;if(p.receipt_no)i.rc=p.receipt_no;if(p.verify_status=='approved')i.paid=tsv(p.paid_at||p.verified_at);i._pid=p.id}
  const rjp=(pmBy[v.id]||[]).filter(x=>x.verify_status=='rejected').sort((a,b)=>String(b.submitted_at).localeCompare(String(a.submitted_at)))[0];
  if(!p&&rjp&&i.s=='unpaid')i.rj=rjp.reject_reason||'ไม่ระบุเหตุผล';
  return i});
 D.tk=[];for(const t of tk){let imgs=[];if((t.image_paths||[]).length){const r=await c.storage.from('attachments').createSignedUrls(t.image_paths,3600);imgs=((r&&r.data)||[]).map(x=>x.signedUrl).filter(Boolean)}
  const a0=D.users.find(x=>x._uid==t.author_id);D.tk.push({id:t.code,uid:a0?a0.id:null,name:t.author_name,room:t.author_room?+t.author_room:null,cat:t.category,title:t.title,body:t.body,imgs,imgp:t.image_paths||[],t:tsv(t.created_at),s:t.status,reply:t.admin_reply||undefined,rby:t.replied_by||undefined,rt:tsv(t.replied_at),_id:t.id,_au:t.author_id})}
 D.news=nw.map(n=>({id:n.id,t:tsv(n.created_at),title:n.title,body:n.body,by:n.author_name,_id:n.id}));
 D.log=lgs.map(l=>({t:tsv(l.created_at),by:l.actor_name,a:l.action}));
 D.mail=ml.map(m=>({t:tsv(m.sent_at||m.created_at),to:m.to_email,sj:m.subject,k:m.kind=='invoice'?'inv':'rcp',inv:(iv.find(x=>x.id==m.invoice_id)||{}).code,st:{pending:'sending',sent:'ok',failed:'fail',wait:'wait'}[m.status],er:m.error||'',_id:m.id}));
 D.contacts=[];if(!ad){const r=await c.rpc('get_contacts');D.contacts=((r&&r.data)||[]).map(x=>({role:x.role,name:x.full_name,phone:x.phone}))}
 if(U){const n=D.users.find(x=>x._uid==SBX.uid);if(n)U=n}
 SBX.snap=sbRows();
}

// ---------- แปลงข้อมูลในหน้าเว็บเป็นแถวของตาราง (ใช้เทียบหาสิ่งที่เปลี่ยนแล้วบันทึกกลับ) ----------
function sbPrep(){
 if(!U||U.role!='admin')return;
 D.users.forEach(u=>{if(u.role=='tenant'&&u._tid&&u.room&&(!u._cid||u._crm!=u.room)){u._oldc=(u._cid&&u._crm!=u.room)?u._cid:null;u._cid=NEWID();u._crm=u.room}});
 D.inv.forEach(i=>{i._id=i._id||NEWID();i._mid=i._mid||NEWID();if(!i._cid){const u=D.users.find(x=>x.id==i.uid);i._cid=u&&u._cid}if((i.mt||i.slip||i.s=='paid')&&!i._pid)i._pid=NEWID()});
 D.news.forEach(n=>{n._id=n._id||NEWID()});
}
function sbRows(){
 const o={},A=(t,k,r)=>((o[t]=o[t]||{})[k]=r),S=D.set,ad=U&&U.role=='admin';
 if(S._id)A('app_settings',S._id,{id:S._id,rent_rate:S.rent,electricity_rate:S.rate,default_deposit:S.dep,fine_per_day:S.fpd||50,max_fine:S.max,due_day:S.due,promptpay_id:S.pp||null,dorm_name:S.name||null,address:S.addr||null,phone:S.tel||null,tax_id:S.tax||null,payee_name:S.payee||null,system_url:S.url||null,line_id:S.line||null});
 D.rooms.forEach(r=>r._id&&A('rooms',r._id,{id:r._id,room_no:String(r.n),occupancy_status:r.st||'free',current_meter:r.m}));
 D.users.forEach(u=>{
  if(u._uid&&(ad||u._uid==SBX.uid))A('users',u._uid,{id:u._uid,full_name:u.name,phone:u.tel||null,gender:u.g||null,lang:(u.pf&&u.pf.lang)||'th'});
  if(u.role=='tenant'&&u._tid){A('tenants',u._tid,{id:u._tid,full_name:u.name,phone:u.tel||null,gender:u.g||null});
   const rr=u.room&&D.rooms.find(x=>x.n==u.room);
   if(rr&&u._cid)A('contracts',u._cid,{id:u._cid,tenant_id:u._tid,room_id:rr._id,start_date:DD(u.cs),end_date:u.ce?DD(u.ce):null,deposit_amount:D.set.dep,status:u.out?'ended':'active',moved_out_at:u.out?ISO(u.out):null})}});
 D.inv.forEach(i=>{if(!i._id)return;const g=(t,r)=>A('invoice_items',i._id+':'+t,r),rm0=D.rooms.find(r=>r.n==i.room)||{};
  A('invoices',i._id,{id:i._id,code:i.id,contract_id:i._cid,billing_month:i.per,issue_date:DD(i.iss),due_date:DD(due(i).getTime()),status:i.s,total_amount:base(i)+(i.fine||0)});
  if(i._mid)A('meter_readings',i._mid,{id:i._mid,room_id:rm0._id,billing_month:i.per,previous_reading:i.pv,current_reading:i.pv+i.u});
  g('rent',{invoice_id:i._id,item_type:'rent',description:null,amount:i.rent});
  g('electricity',{invoice_id:i._id,item_type:'electricity',meter_reading_id:i._mid||null,description:null,amount:i.el});
  if(i.x)g('other',{invoice_id:i._id,item_type:'other',description:i.xn||null,amount:i.x});
  if(i.fine)g('fine',{invoice_id:i._id,item_type:'fine',description:null,amount:i.fine});
  if(i._pid&&(i.mt||i.slip||i.s=='paid'))A('payments',i._pid,{id:i._pid,invoice_id:i._id,receipt_no:(i.rc&&i.rc[0]!='(')?i.rc:null,payment_method:i.mt||'cash',slip_url:i.slip||null,amount_paid:base(i)+(i.fine||0),verify_status:i.s=='paid'?'approved':'pending',submitted_at:ISO(i.sub),paid_at:i.paid?ISO(i.paid):null,verified_at:i.paid?ISO(i.paid):null})});
 D.tk.forEach(t=>{if(t._id)A('support_tickets',t._id,{id:t._id,code:t.id,author_id:t._au,author_name:t.name||null,author_room:t.room?String(t.room):null,category:t.cat,title:t.title,body:t.body,status:t.s,admin_reply:t.reply||null,replied_by:t.rby||null,replied_at:t.rt?ISO(t.rt):null,image_paths:t.imgp||[],created_at:ISO(t.t)})});
 D.news.forEach(n=>{if(n._id)A('news',n._id,{id:n._id,title:n.title,body:n.body,author_name:n.by||null,created_at:ISO(n.t)})});
 return o;
}
// ---------- บันทึกกลับ: เทียบกับสถานะล่าสุดที่โหลดมา แล้ว insert/update/ลบ เฉพาะส่วนที่เปลี่ยน ----------
const sbFlush=()=>{clearTimeout(SBX.t);return SBX.q=SBX.q.then(sbPush).catch(er=>tt('⚠ บันทึกไม่สำเร็จ: '+(er.message||er)))};
function sbSync(){clearTimeout(SBX.t);SBX.t=setTimeout(()=>{SBX.q=SBX.q.then(sbPush).catch(er=>tt('⚠ บันทึกไม่สำเร็จ: '+(er.message||er)))},250)}
async function sbPush(){
 if(!U||!SBX.cl)return;sbPrep();
 const c=SBX.cl,now=sbRows(),old=SBX.snap,ad=U.role=='admin';let mailTrig=false,payChg=false;
 const ok=(t,k)=>ad||(t=='users'?k==SBX.uid:t=='tenants'?k==U._tid:t=='support_tickets'?now[t][k].author_id==SBX.uid:false);
 const sel=(b,t,k)=>{if(t=='invoice_items'){const[a,y]=k.split(':');return b.eq('invoice_id',a).eq('item_type',y)}return b.eq('id',k)};
 const upd=async(t,k,row)=>{const r=await sel(c.from(t).update(row),t,k);if(r.error)throw r.error};
 if(ad)for(const u of D.users)if(u._oldc){const r=await c.from('contracts').update({status:'ended',moved_out_at:new Date().toISOString()}).eq('id',u._oldc);if(r.error)throw r.error;u._oldc=null}
 for(const t of SB_ORD){
  const nr=now[t]||{},or=old[t]||{};let ks=Object.keys(nr);
  if(t=='contracts')ks.sort((a,b)=>(nr[a].status=='ended'?0:1)-(nr[b].status=='ended'?0:1));
  for(const k of ks){if(!ok(t,k))continue;const row=nr[k];
   if(!(k in or)){if(t=='users'||t=='tenants')continue;
    const r=await c.from(t).insert(row);if(r.error){if(r.error.code=='23505')await upd(t,k,row);else throw r.error}
    if(t=='invoices')mailTrig=true;if(t=='payments')payChg=true}
   else if(JSON.stringify(or[k])!==JSON.stringify(row)){await upd(t,k,row);if(t=='payments'){payChg=true;if(row.verify_status=='approved')mailTrig=true}}}
  if(ad)for(const k in or){if(k in nr)continue;
   if(t=='payments'){const v=D.inv.find(x=>x._pid==k);await upd(t,k,{verify_status:'rejected',reject_reason:(v&&v._rjr)||null});payChg=true;if(v){delete v._pid;delete v._rjr}}
   else if(t=='invoice_items'){const[a,y]=k.split(':'),r=await c.from(t).delete().eq('invoice_id',a).eq('item_type',y);if(r.error)throw r.error}
   else if(t=='news'){const r=await c.from(t).delete().eq('id',k);if(r.error)throw r.error}}}
 SBX.snap=sbRows();
 if(payChg&&ad)setTimeout(()=>{if(U)sbRefresh()},1200); // โหลดเลขใบเสร็จที่ฐานข้อมูลออกให้
 if(mailTrig&&ad)c.functions.invoke('resend-email',{body:{sweep:true}}).then(()=>setTimeout(()=>{if(U)sbRefresh()},3000)).catch(()=>{});
}
function sbAudit(a){if(SBX.cl&&SBX.uid&&U)SBX.cl.from('audit_logs').insert({actor_id:SBX.uid,actor_name:U.name,action:a}).then(()=>{})}
// ---------- เรียลไทม์ ----------
function sbRT(){if(SBX.ch||!SBX.cl)return;SBX.ch=SBX.cl.channel('ttm-live').on('postgres_changes',{event:'*',schema:'public'},()=>{clearTimeout(SBX.rt);SBX.rt=setTimeout(sbRefresh,700)}).subscribe()}
async function sbRefresh(){
 if(!U)return;const busy=getComputedStyle($('#mo')).display!='none'||/INPUT|SELECT|TEXTAREA/.test((document.activeElement||{}).tagName||'');
 if(busy){clearTimeout(SBX.rt);SBX.rt=setTimeout(sbRefresh,3000);return}
 try{await sbLoad();R()}catch(x){}
}

if(SBON){
 document.body.classList.add('sbon');
 dl=async function(){
  const em=$('#em').value.trim().toLowerCase(),pw=$('#pw').value;if(!em||!pw)return alert('กรอกอีเมลและรหัสผ่าน');
  const{error}=await SBX.cl.auth.signInWithPassword({email:em,password:pw});
  if(error)return alert(/confirm/i.test(error.message)?'กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ (ตรวจสอบกล่องจดหมายของคุณ)':'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
  try{await sbEnter(1)}catch(x){alert(x.message||x)}};
 fp=async function(){
  const m=$('#em').value.trim().toLowerCase();if(!m)return alert('กรอกอีเมล');if(!MAILOK(m))return alert(MAILMSG);
  const{error}=await SBX.cl.auth.resetPasswordForEmail(m,{redirectTo:location.href.split('#')[0].split('?')[0]});
  if(error)return alert(error.message);go('login');alert('ส่งลิงก์ตั้งรหัสผ่านใหม่ไปที่อีเมลแล้ว กรุณาตรวจสอบกล่องจดหมาย')};
 rp=async function(){
  const w=$('#pw').value;if(w.length<6)return alert('รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัว');if(w!=$('#pw2').value)return alert('ยืนยันรหัสผ่านไม่ตรงกัน');
  const{error}=await SBX.cl.auth.updateUser({password:w});if(error)return alert(error.message);
  SBX.recov=false;await SBX.cl.auth.signOut();try{history.replaceState(null,'',location.pathname)}catch(x){}sbReset();go('login');alert('ตั้งรหัสผ่านใหม่สำเร็จ กรุณาเข้าสู่ระบบ')};
 out=function(){const r=U&&U.role,purge=()=>{try{Object.keys(localStorage).filter(k=>/^sb-.*-auth-token/.test(k)).forEach(k=>localStorage.removeItem(k))}catch(x){}};
  try{const p=SBX.cl.auth.signOut();if(p&&p.catch)p.catch(()=>{})}catch(x){}
  try{sbReset()}catch(x){}
  U=null;P='home';try{localStorage.removeItem('ttm_s')}catch(x){}
  lout(r);
  setTimeout(purge,1500);try{pubLoad()}catch(x){}};
 pc=async function(){
  const o=$('#p_o').value,w=$('#p_w').value;if(w.length<6)return alert('รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัว');if(w!=$('#p_c').value)return alert('ยืนยันรหัสผ่านไม่ตรงกัน');
  const a=await SBX.cl.auth.signInWithPassword({email:U.email,password:o});if(a.error)return alert('รหัสผ่านปัจจุบันไม่ถูกต้อง');
  const{error}=await SBX.cl.auth.updateUser({password:w});if(error)return alert(error.message);
  lg('เปลี่ยนรหัสผ่าน');R();alert('เปลี่ยนรหัสผ่านสำเร็จ\nครั้งต่อไปให้เข้าสู่ระบบด้วยรหัสผ่านใหม่')};
 ps=function(){
  const n=$('#p_n').value.trim(),t=$('#p_t').value.trim();if(!n)return alert('กรอกชื่อ');if(t&&!/^[0-9\-+ ]{9,15}$/.test(t))return alert('เบอร์โทรไม่ถูกต้อง');
  Object.assign(U,{name:n,tel:t,g:$('#p_g').value});lg('แก้ไขโปรไฟล์');save();R();tt('✓ บันทึกข้อมูลแล้ว')};
 {const _p=pg.prof;pg.prof=()=>_p().replace('id="p_e"','id="p_e" disabled')}
 ad=async function(n){
  const a=$('#an').value.trim(),m=$('#ae').value.trim().toLowerCase(),p=$('#ap').value,t=$('#at').value.trim();
  if(!a||!m||p.length<6)return alert('กรอกชื่อ อีเมล และรหัสผ่านอย่างน้อย 6 ตัว');
  if(!/^\S+@\S+\.\S+$/.test(m))return alert('รูปแบบอีเมลไม่ถูกต้อง');
  if(t&&!/^[0-9\-+ ]{9,15}$/.test(t))return alert('เบอร์โทรไม่ถูกต้อง');
  const r=await SBX.cl.functions.invoke('create-tenant',{body:{email:m,password:p,full_name:a,phone:t}});
  if(r.error){let msg=r.error.message;try{const j=await r.error.context.json();if(j&&j.error)msg=j.error}catch(x){}return alert(msg)}
  const uid=r.data&&r.data.user_id;
  await sbLoad();const u=D.users.find(x=>x._uid==uid);if(!u)return alert('สร้างบัญชีแล้วแต่ยังไม่พบข้อมูล กรุณารีเฟรชหน้า');
  u.room=n;u.cs=Date.now();lg('เพิ่มผู้เช่า ห้อง '+n);save();cm();R();
  const txt='T&T Mansion\nอีเมลเข้าสู่ระบบ: '+m+'\nรหัสผ่านเริ่มต้น: '+p+'\nแนะนำให้เปลี่ยนรหัสผ่านในหน้าโปรไฟล์หลังเข้าสู่ระบบครั้งแรก';
  try{await navigator.clipboard.writeText(txt)}catch(x){}
  alert('สร้างบัญชีผู้เช่าแล้ว (ห้อง '+n+')\n\n'+txt+'\n\n(คัดลอกข้อความนี้ไว้ให้แล้ว ส่งให้ผู้เช่าทางอีเมลหรือ LINE)')};
 {const _e=et;et=function(id){_e(id);const w=$('#f_w'),m=$('#f_e');if(w){w.previousElementSibling.style.display='none';w.style.display='none'}if(m)m.disabled=true}}
 eu=function(id){
  const u=D.users.find(x=>x.id==id),n=$('#f_n').value.trim(),r=+$('#f_r').value,go2=$('#f_s').value=='out';if(!n)return alert('กรอกชื่อ');
  if(!go2&&r){const o=act(r),rr=D.rooms.find(x=>x.n==r);if(o&&o.id!=id)return alert('ห้อง '+r+' มีผู้เช่าอยู่แล้ว');if(rr.st)return alert('ห้อง '+r+' ไม่ว่าง/ปิดปรับปรุง กรุณาเปลี่ยนสถานะห้องเป็นว่างก่อน')}
  if(!u.room&&r)u.cs=Date.now();Object.assign(u,{name:n,tel:$('#f_t').value.trim(),room:r||null});if(go2){if(!u.out)u.out=Date.now()}else delete u.out;
  lg('แก้ไขผู้เช่า '+n);save();cm();R();tt('✓ บันทึกข้อมูลผู้เช่าแล้ว')};
 {const _s=pg.set;pg.set=()=>_s().replace(/<div class="cd"><label>EmailJS[^<]*<\/label>.*?<\/div><\/div>/g,'')}
 ss=function(){const s=D.set;['rent','rate','dep','due','max'].forEach(k=>s[k]=+$('#s_'+k).value||0);['pp','tax','name','payee','tel','addr','url'].forEach(k=>s[k]=$('#s_'+k).value.trim());lg('แก้ไขการตั้งค่า');save();tt('✓ บันทึกแล้ว')};
 mail=async function(){};   // อีเมลส่งโดยเซิร์ฟเวอร์ (trigger + Edge Function resend-email)
 rs2=async function(x){const m=D.mail[x];const r=await SBX.cl.from('email_queue').update({status:'pending',error:null,send_after:new Date().toISOString()}).eq('id',m._id);if(r.error)return alert(r.error.message);tt('กำลังส่งอีเมลอีกครั้ง…');try{await SBX.cl.functions.invoke('resend-email',{body:{sweep:true}})}catch(x){}await sbLoad();R()};
 sub=async function(id){
  const i=gi(id),pd=i.s=='pending';if(!SLIP)return alert('กรุณาอัปโหลดสลิปโอนเงิน');
  const path=i._id+'/'+Date.now()+'.jpg',up=await SBX.cl.storage.from('slips').upload(path,d2b(SLIP),{contentType:'image/jpeg'});
  if(up.error)return alert('อัปโหลดสลิปไม่สำเร็จ: '+up.error.message);
  const{error}=await SBX.cl.rpc('submit_payment',{p_invoice:i._id,p_slip:path});if(error)return alert(error.message);
  lg((pd?'ส่งสลิปใหม่ ':'แจ้งชำระ ')+id);cm();await sbLoad();R();tt(pd?'✓ ส่งสลิปใหม่แล้ว รอผู้ดูแลตรวจสอบ':'✓ แจ้งชำระเงินแล้ว รอผู้ดูแลตรวจสอบ')};
 vs=async function(id){
  const i=gi(id);let src=i.slip;if(src&&!/^data:/.test(src)){const r=await SBX.cl.storage.from('slips').createSignedUrl(src,600);src=r.data&&r.data.signedUrl;if(!src)return alert('เปิดสลิปไม่สำเร็จ')}
  mo(`<h3>สลิป ${id}</h3><img src="${src}" style="width:100%;border-radius:12px;margin:12px 0"><button class="b b2" onclick="cm()">ปิด</button>`)};
 cpf=async function(el){
  const f=el.files[0];el.value='';if(!f)return;if(f.type!='application/pdf'&&!/\.pdf$/i.test(f.name))return alert('รองรับเฉพาะไฟล์ PDF');if(f.size>5*1024*1024)return alert('ไฟล์ใหญ่เกิน 5MB');
  const r=D.rooms.find(x=>x.n==CPR);if(!r)return;const path=r.n+'.pdf';
  const up=await SBX.cl.storage.from('contracts').upload(path,f,{upsert:true,contentType:'application/pdf'});if(up.error)return alert('อัปโหลดไม่สำเร็จ: '+up.error.message);
  const u=await SBX.cl.from('rooms').update({contract_pdf_path:path,contract_pdf_name:f.name,contract_pdf_size:f.size}).eq('id',r._id);if(u.error)return alert(u.error.message);
  r.pdf={name:f.name,size:f.size,path};lg('อัปโหลดไฟล์สัญญา ห้อง '+r.n);R();tt('✓ อัปโหลดไฟล์สัญญา ห้อง '+r.n+' แล้ว')};
 cpd=function(n){cf('ลบไฟล์สัญญาห้อง '+n+'?',async()=>{const r=D.rooms.find(x=>x.n==n);if(!r||!r.pdf)return;await SBX.cl.storage.from('contracts').remove([r.pdf.path]);
  const u=await SBX.cl.from('rooms').update({contract_pdf_path:null,contract_pdf_name:null,contract_pdf_size:null}).eq('id',r._id);if(u.error)return alert(u.error.message);delete r.pdf;lg('ลบไฟล์สัญญา ห้อง '+n);R()})};
 cpv=async function(n){
  const r=D.rooms.find(x=>x.n==n);if(!r||!r.pdf)return;const s=await SBX.cl.storage.from('contracts').createSignedUrl(r.pdf.path,600);if(!s.data)return alert('เปิดไฟล์ไม่สำเร็จ');const u=s.data.signedUrl;
  mo(`<h3>สัญญาเช่า ห้อง ${n}</h3><small class="mu">${e(r.pdf.name)}</small>${innerWidth>800?`<iframe src="${u}" style="width:100%;height:62vh;border:1px solid var(--ln);border-radius:12px;margin:10px 0"></iframe>`:'<br><br>'}<a class="b" style="display:inline-block;text-decoration:none" target="_blank" rel="noopener" href="${u}">เปิดไฟล์สัญญา</a> <button class="b b2" onclick="cm()">ปิด</button>`);$('#mc').style.maxWidth='860px'};
 crs=async function(){
  const o=document.createElement('canvas');o.width=o.height=256;o.getContext('2d').drawImage(CR.m,(10-CR.x)/CR.s,(10-CR.y)/CR.s,260/CR.s,260/CR.s,0,0,256,256);
  const blob=d2b(o.toDataURL('image/jpeg',.85));CR=null;const path=SBX.uid+'.'+Date.now()+'.jpg',old=U._avp;
  const up=await SBX.cl.storage.from('avatars').upload(path,blob,{contentType:'image/jpeg'});if(up.error)return alert('อัปโหลดรูปไม่สำเร็จ: '+up.error.message);
  const r=await SBX.cl.from('users').update({avatar_path:path}).eq('id',SBX.uid);if(r.error)return alert(r.error.message);
  U.av=pubUrl('avatars',path);U._avp=path;if(old)SBX.cl.storage.from('avatars').remove([old]);lg('เปลี่ยนรูปโปรไฟล์');cm();R();tt('✓ เปลี่ยนรูปโปรไฟล์แล้ว')};
 pr=function(){cf('ลบรูปโปรไฟล์?',async()=>{const old=U._avp;const r=await SBX.cl.from('users').update({avatar_path:null}).eq('id',SBX.uid);if(r.error)return alert(r.error.message);
  if(old)SBX.cl.storage.from('avatars').remove([old]);delete U.av;U._avp=null;lg('ลบรูปโปรไฟล์');R();tt('✓ ลบรูปแล้ว')})};
 ls=async function(){
  const id=$('#l_id').value.trim(),upd={line_id:id||null,updated_at:new Date().toISOString()};
  if(/^data:/.test(LQ)){const np='line_qr_'+Date.now()+'.png',up=await SBX.cl.storage.from('branding').upload(np,d2b(LQ),{contentType:'image/png'});if(up.error)return alert('อัปโหลดไม่สำเร็จ: '+up.error.message);upd.line_qr_path=np}
  else if(!LQ){upd.line_qr_path=null}
  const r=await SBX.cl.from('app_settings').update(upd).eq('id',D.set._id);if(r.error)return alert(r.error.message);
  const oq=D.set._lqp;if(upd.line_qr_path!==undefined&&oq&&oq!==upd.line_qr_path)SBX.cl.storage.from('branding').remove([oq]).catch(()=>{});if(upd.line_qr_path!==undefined)D.set._lqp=upd.line_qr_path||undefined;
  D.set.line=id;if(upd.line_qr_path)D.set.lineqr=pubUrl('branding',upd.line_qr_path)+'?v='+Date.now();else if(upd.line_qr_path===null)delete D.set.lineqr;
  lg('แก้ไขช่องทาง LINE');cm();R();tt('✓ บันทึกแล้ว')};
 tks=async function(){
  const c=$('#tkc').value,t=$('#tkt').value.trim(),b=$('#tkb').value.trim();if(!c||!t||!b)return alert('กรอกหมวดหมู่ หัวข้อ และรายละเอียดให้ครบ');
  const code='TK'+Date.now(),paths=[];let k=0;
  for(const d of TKI){const p=SBX.uid+'/'+code+'/'+(k++)+'.jpg',up=await SBX.cl.storage.from('attachments').upload(p,d2b(d),{contentType:'image/jpeg'});if(up.error)return alert('อัปโหลดรูปไม่สำเร็จ: '+up.error.message);paths.push(p)}
  D.tk.unshift({id:code,uid:U.id,name:U.name,room:U.room||null,cat:c,title:t,body:b,imgs:TKI.slice(),imgp:paths,t:Date.now(),s:'open',_id:NEWID(),_au:SBX.uid});
  lg('ส่งคำขอช่วยเหลือ: '+t);save();R();tt('✓ ส่งคำขอแล้ว เราจะตอบกลับโดยเร็วที่สุด')};
}

applyPf(U);R();try{const lo=sessionStorage.getItem('ttm_lo');if(lo){sessionStorage.removeItem('ttm_lo');setTimeout(()=>tt('✓ ออกจากระบบสำเร็จ'+(RL[lo]?' · '+RL[lo]:'')),400)}}catch(x){}if(SBON)sbBoot().catch(x=>alert('เชื่อมต่อ Supabase ไม่สำเร็จ: '+(x.message||x)));
    
