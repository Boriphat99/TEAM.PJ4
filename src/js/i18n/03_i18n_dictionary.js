/* 03_i18n_dictionary.js — พจนานุกรมแปลภาษา ไทย/อังกฤษ (ขนาดใหญ่)
   (แยกมาจาก script.js บรรทัด 12-656; โหลดเรียงตามเลขหน้าชื่อไฟล์ใน index.html) */
const LOCF = () => (LANG == 'en' ? 'en-GB' : 'th-TH'),
  ENm = `ขอบคุณที่ใช้บริการ T&T Mansion · เอกสารนี้ออกโดยระบบ|Thank you for your payment · T&T Mansion · Issued by the system
คำขอความช่วยเหลือจากผู้ใช้|Help requests from users
ตัวเลขอ้างอิงจากการตั้งค่าของหอพัก|Figures based on the settings of
พื้นที่ใส่ QR LINE|LINE QR area
ยอด QR ขึ้นอัตโนมัติ|QR amount filled in automatically
ยังไม่ได้ตั้งค่า LINE ID|LINE ID not set
รายรับค่าไฟ 6 เดือนล่าสุด|Electricity revenue, last 6 months
รายได้ 6 เดือนล่าสุด|Income, last 6 months
สร้าง QR ตามยอดสุทธิของใบแจ้งหนี้อัตโนมัติ|QR is generated automatically from the invoice total
สแกน QR ยอดขึ้นอัตโนมัติ|Scan the QR, the amount fills in automatically
เอกสารนี้ออกโดยระบบ T&T Mansion|Issued by the T&T Mansion system
ช้าเฉลี่ย|Avg. delay
สร้างบัญชีเข้าสู่ระบบให้ผู้เช่า พร้อมเปิดสัญญาเช่า|Create a login for the tenant and open the lease
สร้างบัญชีและเปิดสัญญา|Create account and open lease
บัญชีเข้าสู่ระบบ|Login account
ข้อมูลผู้เช่า|Tenant details
รหัสผ่านเริ่มต้น|Initial password
สุ่มใหม่|Regenerate
ผู้เช่าจะได้รับการแจ้งเตือนให้เปลี่ยนรหัสผ่านเองหลังเข้าสู่ระบบครั้งแรก|The tenant will be asked to change the password after the first sign-in
เว้นวันสิ้นสุดว่างไว้ = ไม่กำหนด|Leave the end date empty for no end date
(บันทึกครั้งเดียว ณ วันเริ่มสัญญา)|(recorded once on the contract start date)
ไฟล์สัญญาเช่า (PDF ไม่บังคับ)|Lease file (PDF, optional)
สลิปโอนเงินที่ผู้เช่าส่งมา|Transfer slip sent by the tenant
สลิปที่ผู้เช่าส่ง|Slips sent by tenants
ดูสลิป|View slip
ยอดที่แจ้งชำระ|Amount reported
(ปิดรอบ)|(closed)
เปิดอยู่ · ออกบิลและแก้ไขได้ถึงวันที่ 10 ของ|is open · you can issue invoices and edit until the 10th of 
บิล · รวม|bills · total
บิล|bills
เกิน |Over 
 ใช้ | used 
ใช้ |used 
อัปเดตอัตโนมัติ|Updates automatically
รายรับ 6 เดือนล่าสุด|Income, last 6 months
รายรับ 6 เดือน|6-month income
พร้อมเพย์|PromptPay
ครบกำหนดชำระ|Payment due
ช่องทางชำระเงิน|Payment channel
วันสิ้นสุดสัญญา|Contract end date
จำนวนห้องพักทั้งหมดในระบบ|Total rooms in the system
ยอดรวมใบเรียกเก็บที่ชำระแล้วของรอบบิลปัจจุบัน|Total of paid bills in the current billing cycle
รายได้ที่ชำระแล้วของรอบบิลก่อนหน้า|Paid income of the previous billing cycle
รายได้ที่ชำระแล้วสะสมตั้งแต่ต้นปี|Paid income since the start of the year
เปอร์เซ็นต์การเปลี่ยนแปลงของรายได้เทียบกับเดือนก่อน|Income change compared with last month (%)
ใบเรียกเก็บที่ผู้เช่ายังไม่แจ้งชำระ|Bills the tenant has not paid yet
ใบเรียกเก็บที่เกินวันที่ 10 ของเดือนถัดไปและยังไม่ชำระ|Bills past the 10th of the next month and still unpaid
ไม่เกิน 5MB|up to 5MB
รอบ |Cycle 
หรือลากไฟล์มาวางที่นี่| or drop the file here
เลือกรูปสลิป|Choose slip image
JPG หรือ PNG ไม่เกิน 8 MB|JPG or PNG, up to 8 MB
กดที่กรอบเพื่อเปลี่ยนรูป|Tap the box to change the image
กำลังตรวจ QR บนสลิป…|Checking the QR on the slip…
พบ QR ของสลิป|Slip QR found
ไม่พบ QR บนสลิป · ควรใช้รูปสลิปจากแอปธนาคารแบบเต็มใบ ไม่ตัดมุม|No QR found on the slip · use the full, uncropped slip from your banking app
QR บนสลิปถูกต้อง|Slip QR is valid
ไม่ซ้ำกับสลิปอื่นในระบบ|not used by any other slip
ยอดเงินยังต้องตรวจกับรายการเงินเข้าบัญชี หรือสแกน QR ด้วยแอปธนาคาร|The amount still needs checking against the account statement or by scanning the QR in a banking app
ไม่พบ QR บนรูปสลิปนี้ · ควรตรวจกับรายการเงินเข้าบัญชีอย่างละเอียด|No QR found on this slip · check it carefully against the account statement
โอนจาก|Sent from 
กำลังอ่าน QR บนรูปสลิป…|Reading the slip QR…
เลขอ้างอิงบนสลิปนี้ซ้ำกับสลิปของห้อง|This slip reference matches the slip of room
ควรตรวจสอบก่อนอนุมัติ|check before approving
สลิปนี้ถูกใช้ซ้ำ ใช้แจ้งชำระไม่ได้ กรุณาแนบสลิปของรายการโอนครั้งนี้|This slip has already been used. Please attach the slip for this transfer
ระบบไม่พบ QR บนรูปสลิปนี้|No QR was found on this slip
ผู้ดูแลอาจต้องใช้เวลาตรวจสอบนานขึ้น|The admin may need longer to check it
ต้องการส่งสลิปนี้ต่อหรือไม่?|Send this slip anyway?
เลขอ้างอิง|Reference
ธนาคารกรุงเทพ|Bangkok Bank
ธนาคารกสิกรไทย|Kasikornbank
ธนาคารกรุงไทย|Krungthai Bank
ธนาคารทหารไทยธนชาต|TTB
ธนาคารไทยพาณิชย์|SCB
ธนาคารกรุงศรีอยุธยา|Krungsri
ธนาคารออมสิน|Government Savings Bank
ธนาคารซีไอเอ็มบี ไทย|CIMB Thai
ธนาคารยูโอบี|UOB
ธนาคารเกียรตินาคินภัทร|Kiatnakin Phatra
เรียน (ผู้เช่า)|To (tenant)
สแกน PromptPay QR ในระบบ แล้วแนบสลิป|Scan the PromptPay QR in the system, then attach the slip
หรือชำระเงินสดที่เคาน์เตอร์|or pay cash at the counter
กรุณาชำระภายในวันที่|Please pay by
หากชำระหลังวันครบกำหนด คิดค่าปรับวันละ|after the due date the late fee is
หากพ้นวันที่ 10 ถือว่าผิดนัดชำระตามสัญญาเช่า|after the 10th the payment is in default under the lease
ผู้ออกใบแจ้งหนี้|Issued by
เอกสารนี้ออกโดยระบบ|Issued by the system
โอนเงินผ่านพร้อมเพย์|PromptPay transfer
ตรวจสอบใบเสร็จ|Verify this receipt
สแกน QR เพื่อตรวจว่าใบเสร็จนี้ออกโดยระบบจริง|Scan the QR to check this receipt was issued by the system
และจำนวนเงินตรงกับข้อมูลของหอพัก|and that the amount matches the dorm's records
ไม่มีบิลค้างชำระ|No outstanding bills
รายรับ 6 เดือนล่าสุด (บาท)|Income, last 6 months (baht)
สูงสุดไม่เกิน|up to
เลขมิเตอร์|Meter
พร้อมเพย์ |PromptPay 
LINE ติดต่อสอบถาม|LINE for questions
ติดต่อสอบถาม|Contact us
สแกน QR หรือค้นหา LINE ID เพื่อพูดคุยกับผู้ดูแลหอพัก|Scan the QR or search the LINE ID to chat with the dorm staff
LINE ID สำหรับพูดคุย (LINE ส่วนตัว หรือ OA ที่มีคนตอบ)|LINE ID for chatting (a personal LINE or a staffed OA)
LINE แจ้งเตือน (บอท)|LINE notifications (bot)
Bot basic ID ของบอทแจ้งเตือน (ดูได้ใน LINE Developers แท็บ Messaging API)|Bot basic ID of the notification bot (see LINE Developers, Messaging API tab)
ส่งแจ้งเตือนบิล วันครบกำหนด และใบเสร็จให้อัตโนมัติ|Sends bill, due date and receipt alerts automatically
ตอบคำถามไม่ได้|cannot answer questions
เพิ่มเพื่อนแล้วเชื่อมบัญชีได้ที่หน้าโปรไฟล์|add it as a friend, then link your account on the Profile page
เพิ่มเพื่อนบอทแจ้งเตือนของหอพัก|Add the dorm's notification bot as a friend
เพิ่มเพื่อนบอท|Add bot
(ผู้ดูแลยังไม่ได้ตั้งค่าบอทในหน้าช่วยเหลือ)|(the admin has not set up the bot on the Help page yet)
กดขอรหัส แล้วพิมพ์รหัส 6 หลักส่งในแชทของบอท|Tap Get code, then send the 6-digit code in the bot's chat
แก้ไข LINE|Edit LINE
แจ้งเตือนทาง LINE|LINE notifications
ใช้ได้เมื่อเชื่อมฐานข้อมูลจริง|Available once connected to the live database
รับแจ้งเตือนเมื่อบิลออก ใกล้ครบกำหนด เลยกำหนด และเมื่อใบเสร็จออกแล้ว|Get notified when a bill is issued, when it is almost due, when it is overdue and when your receipt is ready
รับแจ้งเตือนทันทีเมื่อมีผู้เช่าส่งสลิปชำระเงิน|Get notified as soon as a tenant sends a payment slip
เชื่อมแล้ว|Linked
ยังไม่เชื่อม|Not linked
ยกเลิกการเชื่อม|Unlink
เพิ่มเพื่อน|Add friend
รหัสเชื่อมบัญชี|Link code
หมดอายุใน|Expires in
ระบบจะเปลี่ยนสถานะให้เองเมื่อเชื่อมสำเร็จ|the status updates by itself once linked
ขอรหัสใหม่|New code
ขอรหัส|Get code
ตรวจสถานะ|Check status
เชื่อม LINE เรียบร้อยแล้ว|LINE linked
ยังไม่ได้รับรหัสในแชท LINE|The code has not arrived in the LINE chat yet
ยกเลิกการเชื่อม LINE แล้ว|LINE unlinked
ติดตามหนี้ค้าง|Overdue tracking
บิลที่เลยวันครบกำหนดแล้วยังไม่ชำระ|Bills past their due date that are still unpaid
ระบบส่งเตือนทาง LINE อัตโนมัติก่อนครบกำหนด 2 วัน หลังเลยกำหนด 1 วัน และ 5 วัน|LINE reminders go out automatically 2 days before the due date, and 1 and 5 days after it
การส่งเตือนทาง LINE ใช้ได้เมื่อเชื่อมฐานข้อมูลจริง|LINE reminders are available once connected to the live database
ส่งเตือนทุกบิลที่เชื่อม LINE|Remind all LINE-linked bills
ไม่มีบิลค้างชำระ|No overdue bills
เตือนล่าสุด|Last reminder
เลยกำหนด|Overdue
ยอดค้าง|Amount due
ส่งไม่สำเร็จ|failed
ส่งเตือน|Remind
เชื่อม LINE แล้ว|LINE linked
ยังไม่เชื่อม LINE|LINE not linked
ได้รับแจ้งเตือนบิลทาง LINE|Receives bill alerts on LINE
ยังไม่ได้รับแจ้งเตือนทาง LINE|Not receiving LINE alerts
ค้างชำระ|Unpaid
เลขมิเตอร์ตอนย้ายเข้า|Move-in meter reading
จดจากมิเตอร์จริงในวันที่เข้าพัก · บิลแรกจะคิดค่าไฟจากเลขนี้|Read the actual meter on move-in day · the first bill charges electricity from this number
กรุณากรอกเลขมิเตอร์ตอนย้ายเข้า|Please enter the move-in meter reading
เลขมิเตอร์ต้องเป็นจำนวนเต็มไม่ติดลบ|Meter reading must be a non-negative whole number
เลขมิเตอร์ตอนย้ายเข้าต้องไม่น้อยกว่าเลขล่าสุดของห้อง|Move-in reading must not be lower than the latest reading of room
เลขมิเตอร์ตอนย้ายออกต้องเป็นจำนวนเต็มและไม่น้อยกว่าเลขก่อนหน้า|Move-out reading must be a whole number and not lower than the previous reading
เลขมิเตอร์ตอนย้ายออก|Move-out meter reading
ไม่น้อยกว่า|at least
ต้องไม่น้อยกว่า|must be at least
หน่วยที่ใช้|Units used
ค่าไฟช่วงสุดท้าย|Final electricity charge
ระบบจะออกบิลสุดท้าย (ค่าไฟอย่างเดียว) ให้ผู้เช่าชำระเงินสดหรือผ่าน QR · เว้นว่าง = ไม่ออกบิลสุดท้าย|A final bill (electricity only) will be issued; the tenant can pay by cash or QR · leave blank = no final bill
ระบบออกบิลสุดท้าย (ค่าไฟอย่างเดียว) ของห้องเดิม · เว้นว่าง = ไม่ออกบิล|A final bill (electricity only) is issued for the old room · leave blank = no bill
ยืนยันย้ายห้อง|Confirm room change
ปิดปรับปรุง · ย้ายผู้เช่าออก|Maintenance · move tenant out
ย้ายผู้เช่าออก|Move tenant out
ออกบิลสุดท้าย|final bill issued
บิลย้ายออกที่ยังไม่ชำระจะถูกยกเลิก|Unpaid move-out bills will be cancelled
ย้ายกลับเข้าพัก ห้อง|Move back in, room
บิลย้ายออก|Move-out bill
ห้องเดิม|Old room
ห้องใหม่|New room
ย้ายห้อง|Change room
คุณย้ายออกแล้ว · ชำระบิลที่ค้างอยู่ได้ที่หน้านี้ หลังชำระครบบัญชีจะเข้าใช้งานไม่ได้อีก|You have moved out · pay your remaining bills here. After everything is paid this account can no longer sign in
ไม่พบสัญญาของผู้เช่าคนนี้|Contract for this tenant not found
ลบไฟล์สัญญาของ|Delete contract file of
กฎการเรียกเก็บค่าบริการของหอพัก|Dorm billing rules
กฎการเรียกเก็บเงิน|Billing rules
กดค้างที่รูป (มือถือ) หรือคลิกขวา (คอมพิวเตอร์) แล้วเลือกบันทึกรูปภาพ|Long-press the image (mobile) or right-click (desktop), then choose Save image
กดแก้ไขเพื่อเพิ่ม)|press Edit to add)
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
การดำเนินการด่วน|Quick actions
การแสดงผล|Display
กำลังดำเนินการ|In progress
กำลังสร้างรูปใบเสร็จ|Creating receipt image
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
ข้อมูลส่วนตัว|Personal information
ครบกำหนดวันที่|Due on day
ครบกำหนด|Due
ครบทุกขั้นตอนการเก็บค่าหอพัก|Every step of dorm fee collection
ครอปรูปโปรไฟล์|Crop profile photo
ครอปรูปได้ก่อนบันทึก|crop before saving
ครั้งต่อไปให้เข้าสู่ระบบด้วยรหัสผ่านใหม่|Next time, sign in with your new password
ครั้ง|times
คลิกห้องเพื่อแก้ไขข้อมูล|Click a room to edit
คำขอของฉัน|My requests
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
จัดผู้เช่าที่ลงทะเบียนแล้วเข้าห้องนี้|Assign a registered tenant to this room
จัดการห้อง สถานะ และผู้เช่า|Manage rooms, status and tenants
จัดการห้อง|Manage room
จัดเข้าห้อง|Assign to room
จัดห้องให้|Assign a room to
จัดห้อง|Assign room
จำนวนบิล|Number of invoices
จำนวนรอบบิล|Billing cycles
จำนวนเงิน|Amount
จำรหัสผ่านได้แล้ว|Remembered your password
จ่ายตรงเวลา|Paid on time
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
อัปโหลดสลิปไม่สำเร็จ:|Slip upload failed:
อัปโหลดไม่สำเร็จ:|Upload failed:
อัปโหลดรูปไม่สำเร็จ:|Image upload failed:
เปิดไฟล์ไม่สำเร็จ|Could not open the file
ไม่พบข้อมูลบัญชีในระบบ|Account data not found
กรอกอีเมลและรหัสผ่าน|Enter email and password
กรอกอีเมล|Enter email
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
รหัสผ่านต้องมีอย่างน้อย 8 ตัว|Password must be at least 8 characters
รหัสผ่านต้องมีทั้งตัวอักษรและตัวเลข|Password must contain both letters and numbers
รหัสผ่านนี้คาดเดาง่ายเกินไป กรุณาตั้งใหม่|This password is too easy to guess. Please choose another
รหัสผ่านอย่างน้อย 8 ตัว มีตัวอักษรและตัวเลข|At least 8 characters with letters and numbers
(อย่างน้อย 8 ตัว มีตัวอักษรและตัวเลข)|(at least 8 characters, letters and numbers)
รหัสผ่านใหม่ (เว้นว่างถ้าไม่เปลี่ยน)|New password (leave blank to keep)
รหัสผ่านใหม่ (อย่างน้อย|New password (at least
รหัสผ่านใหม่ต้องมีอย่างน้อย|New password must be at least
รหัสผ่าน|Password
รองรับผู้ใช้งาน|Supports
รองรับเฉพาะไฟล์|Only files of type
รองรับเฉพาะ|Only supports
รองรับ|Supports
รอจัดห้อง|Awaiting room
รอดำเนินการ|Pending
รอตรวจสอบ|Under review
รอบบิลปัจจุบัน|Current billing cycle
รอบบิล|Billing cycle
รอผู้ดูแลจัดห้อง|Waiting for admin to assign a room
รอผู้ดูแลตรวจสอบ|Waiting for admin review
ระบบชำระค่าบริการของหอพัก|Dormitory Payment System
ระบุวันเริ่มสัญญา|Enter the contract start date
ระยะเช่าเฉลี่ย|Avg. rental period
รับชำระเงิน|Receive payments
รับเงินสด (เคาน์เตอร์)|Receive cash (counter)
รับเงินสด|Receive cash
รายการ จะยังอยู่ในประวัติของผู้เช่าคนนี้|items will remain in this tenant's history
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
ลงทะเบียนสำเร็จแล้ว รอผู้ดูแลจัดห้องพักให้ จึงจะมีใบแจ้งหนี้|Registered. Invoices will appear once the admin assigns your room
ออกบิลย้อนหลังได้ไม่เกินวันที่ 10 ของเดือนถัดไป|back-dated invoices allowed until the 10th of the next month
🟢 รอบ|🟢 Cycle
🔒 รอบ|🔒 Cycle
เปิดอยู่ · ออกบิลและแก้ไขได้ถึงวันที่ 10 ของ|is open · you can issue invoices and edit until the 10th of
(23:59 น.)|(23:59)
ปิดแล้ว (เกินวันที่ 10 ของเดือนถัดไป) · ดูบิลที่ออกไปแล้วได้อย่างเดียว ไม่สามารถออกบิลย้อนหลัง หรือแก้ไขเลขมิเตอร์/ค่าใช้จ่ายได้|is closed (past the 10th of the next month) · view only: no back-dated invoices or edits to meters/charges
สลิปครั้งก่อนถูกปฏิเสธ|The previous slip was rejected
สลิปถูกปฏิเสธ|Slip rejected
ยอดเงินไม่ตรงกับใบแจ้งหนี้|Amount does not match the invoice
สลิปไม่ชัดเจน อ่านข้อมูลไม่ได้|Slip is unclear or unreadable
สลิปไม่ใช่ของรายการนี้หรือเป็นสลิปซ้ำ|Slip is for another item or a duplicate
ไม่พบยอดเงินเข้าบัญชี|No deposit found in the account
— เลือกเหตุผล —|— Select a reason —
เลือกเหตุผลที่ปฏิเสธ|Select a reason for the rejection
เหตุผล|Reason
อื่นๆ|Other
เลขมิเตอร์ก่อนหน้า 🔒|Previous meter reading 🔒
เลขมิเตอร์ล่าสุด|Latest meter reading
ค่าใช้จ่ายเพิ่มเติม (บาท)|Additional charges (THB)
หมายเหตุ|Note
แก้ไขได้จนกว่าผู้เช่าจะแจ้งชำระ หรือปิดรอบบิล (เกินวันที่ 10 ของเดือนถัดไป)|Editable until the tenant reports payment or the cycle closes (after the 10th of the next month)
แก้เลขมิเตอร์ไม่ได้ เพราะออกบิลรอบถัดไปของห้องนี้แล้ว|The meter reading cannot be edited because the next cycle has already been invoiced for this room
บิลนี้รอตรวจสอบหรือชำระแล้ว จึงแก้ไขไม่ได้|This invoice is pending or paid and cannot be edited
ผู้ดูแลยังไม่ได้ยืนยัน จึงส่งสลิปใหม่ได้ · เมื่อผู้ดูแลยืนยันแล้วจะแก้ไขไม่ได้|The admin has not confirmed yet, so you can resend the slip · once confirmed it can no longer be edited
รอผู้ดูแลตรวจสอบ · ส่งสลิปผิดแก้ไขได้ก่อนผู้ดูแลยืนยัน|Awaiting admin review · you can fix a wrong slip before the admin confirms
แถบ = ยอดที่ชำระแล้วเทียบกับยอดรวมสูงสุดของเดือน|Bar = paid amount vs. the month's highest total
กลับไปดูใบแจ้งหนี้|Back to invoice
เวอร์ชันระบบ|System version
ช่องทาง|Channel

สลับธีม|Toggle theme
ย่อ/ขยายเมนู|Collapse / expand menu
ย่อเมนู|Collapse
กลับขึ้นด้านบน|Back to top
สลิปโอนเงินของผู้เช่า|Tenant transfer slips
ใบเสร็จรับเงินของผู้เช่า|Tenant receipts
รายงานสรุปรายได้|Revenue summary report
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
เริ่มใช้งาน|Get started
ยังไม่มีบัญชี? ติดต่อผู้ดูแลหอพักเพื่อขอสร้างบัญชี|No account yet? Contact the dormitory admin to create one
เข้าสู่ระบบ →|Sign in →
ลบข่าวนี้|Delete this news?
ลบข่าว|Delete news
ลบรูปแล้ว|Image removed
ลบรูปโปรไฟล์|Remove profile photo
ลบรูป|Remove image
ลบไฟล์สัญญา ห้อง|Deleted contract file, room
ลบ|Delete
ลากเพื่อจัดตำแหน่ง · เลื่อนแถบเพื่อซูม|Drag to position · slide to zoom
ลำดับ|No.
ลิงก์เว็บระบบ|System link
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
สถานะห้องพัก|Room status
สถานะห้อง|Room status
สถานะ: ทั้งหมด|Status: All
สถานะ|Status
สรุปรายรับที่ชำระแล้วในช่วงเวลาที่เลือก พิมพ์เป็น|Summary of paid revenue for the selected period. Print as
สรุปรายเดือน|Monthly summary
สรุปรายได้และสถานะการชำระเงิน|Summary of income and payment status
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
ส่งออกแล้ว|Exported
ส่งออก|Export
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
ต้องการออกจากระบบใช่หรือไม่?|Do you want to sign out?
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
เลือก|Select
เวลา|Time
เสร็จสิ้น|Completed
แก้ไขกฎการคำนวณค่าบริการ|Edit fee calculation rules
แก้ไขการตั้งค่า|Edit settings
แก้ไขข้อมูลผู้เช่า|Edit tenant information
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
แบบออนไลน์เรียลไทม์|Online, real-time
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
ใบที่ชำระแล้ว|Paid invoices
ใบเรียกเก็บชำระแล้ว|invoices paid
ใบเรียกเก็บที่ออก|invoices issued
ใบเรียกเก็บเงินที่ชำระแล้ว|Paid invoices
ใบเรียกเก็บเงินล่าสุด|Latest invoices
ใบเสร็จรับเงิน|Receipt
ใบเสร็จ|Receipt
ใบแจ้งหนี้ของฉัน|My invoices
ใบแจ้งหนี้ประจำเดือน|Monthly invoices
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
โหมดกลางวัน|Daytime mode
โหมดกลางคืน|Night mode
ตัว|chars
บัญชี|Account
ทุกอย่างของหอพัก|Everything for your dorm
ในหน้าจอเดียว|on one screen
ดูฟีเจอร์ ›|See features ›
เก็บค่าเช่า ค่าไฟ และออกใบเสร็จ ครบในที่เดียว|Rent, electricity and receipts, all in one place`
    .split('\n')
    .map(l => l.split('|'))
    .filter(x => x.length == 2 && x[0])
    .sort((a, b) => b[0].length - a[0].length),
  THR = /[\u0E00-\u0E7F]/,
  tl = t => {
    if (!THR.test(t)) return t;
    for (const [a, b] of ENm) if (t.includes(a)) t = t.split(a).join(b);
    return t
      .replace(/\byou(?=[A-Z\u0E00-\u0E7F])/g, '')
      .replace(/\bAccount (SCB|KBank|KTB|BBL|BAY|TTB|GSB)\b/g, '$1 account')
      .replace(/^(\d+) Floor$/, (m, n) => n + (n == '1' ? ' floor' : ' floors'))
      .replace(/^(\d+) Vacant$/, '$1 vacant')
      .replace(/(\d+) Room\b/g, '$1 rooms')
      .replace(/\bmax (\d+) image\b/g, 'max $1 images')
      .replace(
        /\b1 (bills|persons|times|days|items|invoices|units|rooms)\b/g,
        (m, a) => '1 ' + a.slice(0, -1)
      );
  },
  tlN = n => {
    if (LANG != 'en') return;
    if (n.nodeType == 3) {
      const v = tl(n.nodeValue);
      if (v !== n.nodeValue) n.nodeValue = v;
    } else if (n.nodeType == 1 && n.tagName != 'SCRIPT' && n.tagName != 'STYLE') {
      ['placeholder', 'title', 'alt', 'aria-label'].forEach(a => {
        if (n.hasAttribute(a)) {
          const o = n.getAttribute(a),
            v = tl(o);
          if (v !== o) n.setAttribute(a, v);
        }
      });
      n.childNodes.forEach(tlN);
    }
  };
