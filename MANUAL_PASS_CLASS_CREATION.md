# 🎯 Alternative: Manually Create Pass Class in Google Pay Console

Since the service account doesn't have permissions yet, you can **manually create the pass class** through the Google Pay Business Console, then the system can create individual passes.

## 📋 Step-by-Step: Manual Pass Class Creation

### Step 1: Go to Google Pay Business Console

1. Visit: https://pay.google.com/business/console
2. Sign in with your Google account

### Step 2: Navigate to Google Wallet API

1. Click **"Google Wallet API"** in the left sidebar
2. You should see your Issuer ID: `3388000000023028646`

### Step 3: Create Generic Pass Class

1. Look for **"Create Class"** or **"Passes"** section
2. Click **"Create a new class"** or **"+"**
3. Choose **"Generic"** as the pass type

### Step 4: Configure the Class

#### **Basic Information:**

- **Class ID**: `3388000000023028646.accessibility_card_class`
  - ⚠️ **IMPORTANT**: Must match exactly!
  - Format: `{IssuerId}.accessibility_card_class`

- **Class Name**: `Canadian Accessibility Card`

- **Issuer Name**: `Government of Canada`

#### **Pass Template (Layout):**

Choose a layout that shows:

1. **Card title area** (top)
2. **Two text fields side-by-side** (name and expiration)
3. **One wide text field** (services)
4. **Barcode/QR code area** (bottom)

#### **Visual Design:**

- **Background color**: `#1e40af` (blue)
- **Text color**: White or automatic
- **Logo**: Upload if you have one (optional for testing)

### Step 5: Save the Class

1. Click **"Save"** or **"Create"**
2. The class will be created with the ID: `3388000000023028646.accessibility_card_class`

### Step 6: Verify Creation

The class should now appear in your Google Pay console under "Classes" or "Generic passes".

## 🧪 Test Creating Individual Passes

Now that the class exists, try creating a pass through your application:

### Option A: Through Admin Approval

1. Start your dev server:

   ```powershell
   npm run dev
   ```

2. Go to admin panel and approve an application

3. Check the server logs - you should see:
   ```
   Pass class already exists ✅
   Creating pass object...
   ```

### Option B: Direct API Test

Create a test script to create a single pass:

```powershell
npx tsx -e "
import { createWalletPass } from './src/lib/googleWallet';

const testPass = await createWalletPass({
  userId: 'test-123',
  fullName: 'John Test',
  email: 'elmasry.wissam@gmail.com',
  dateOfBirth: '1990-01-01',
  expirationDate: new Date(Date.now() + 5*365*24*60*60*1000).toISOString(),
  services: {
    mobilityAid: true,
    supportPerson: true,
    serviceAnimal: false
  }
});

console.log('✅ Pass created!');
console.log('🔗 Add to Wallet:', testPass);
"
```

## 🔍 If It Still Fails

The service account might still need permissions to create **objects** (even if the class exists). In that case:

### Grant Service Account Access via Console

1. Go to: https://pay.google.com/business/console
2. Navigate to **"Google Wallet API"** → **"Service accounts"**
3. Click **"Add service account"**
4. Enter: `carte-47@carte-475700.iam.gserviceaccount.com`
5. Grant **"Developer"** or **"Owner"** role
6. Save

## 📱 Alternative: Use JWT-Only Approach (No Server-Side Creation)

If service account permissions remain blocked, I can switch the implementation to use **JWT-based passes** that don't require server-side API calls:

### How JWT Approach Works:

1. Your server generates a signed JWT with pass data
2. User clicks link with the JWT
3. Google Wallet reads the JWT and creates the pass on-the-fly
4. **No API calls needed** = **No permission issues**

### To Enable JWT Approach:

Would you like me to implement this alternative? It's simpler but has limitations:

- ✅ Works immediately (no Google approval needed)
- ✅ No server-side API calls
- ❌ Can't update passes remotely after creation
- ❌ Can't revoke passes
- ❌ No push notifications

## 🎯 Recommended Next Steps

**For Now (Testing):**

1. Manually create the pass class in Google Pay console (steps above)
2. Test if individual passes can be created
3. If it works: Great! Just wait for full publishing approval
4. If it still fails: Let me know, I'll switch to JWT approach

**For Production:**

- Apply for publishing access (1-3 days)
- Once approved, everything will work automatically
- No manual steps needed

---

Let me know if you'd like me to:

1. Walk you through manual class creation step-by-step
2. Switch to JWT-based approach (works now, no permissions needed)
3. Wait for publishing approval (best long-term solution)
