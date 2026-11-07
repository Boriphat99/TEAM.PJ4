/* 08_promptpay_qr.js — สร้าง PromptPay QR (EMVCo + CRC16)
   (แยกมาจาก script.js บรรทัด 828-845; โหลดเรียงตามเลขหน้าชื่อไฟล์ใน index.html) */
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
