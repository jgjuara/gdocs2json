# gdocs2json Setup and Installation Guide

This document details the steps required to configure and use the document and comments export add-on privately (for personal use) or internally within a Google Workspace organization.

---

## Method 1: Private / Personal Use (Container-bound Script)

This method is the fastest for individual users who want to use the add-on in a specific document without publishing it.

### Step 1: Open the Apps Script Editor
1. Open the Google Docs document where you want to use the add-on.
2. In the top menu, go to **Extensions** > **Apps Script**.

### Step 2: Copy the Project Files
1. In the Apps Script editor, replace the entire content of the default file `Código.gs` (or `Code.gs`) with the content of the `Code.gs` file from this repository. Rename the editor file to `Code.gs` if desired.
2. Click the **+** (Add a file) button next to "Files" and select **HTML**.
3. Name the new file `download` (the editor will add the `.html` extension automatically).
4. Replace the entire content of the newly created `download.html` file with the content of the `download.html` file from this repository.
5. Go to **Project Settings** (gear icon in the left sidebar) and check the option **Show "appsscript.json" manifest file in editor**.
6. Return to the **Editor** tab (code `< >` icon), open the `appsscript.json` file which is now visible, and replace all its content with the content of the `appsscript.json` file from this repository.
7. Save the project by clicking the disk icon (Save project).

### Step 3: Enable Advanced Services (Alternative Manual Method)
> [!NOTE]
> If you copied the `appsscript.json` file in Step 2, this step will already be automatically configured with the required services and scopes, and no manual action is needed.
> 
> If you prefer to add them manually via the interface:
1. In the left sidebar of the Apps Script editor, click the **+** button next to **Services**.
2. In the list of services:
   * Look for **Drive API** and select it. Ensure the version is **v3** (if prompted) and the identifier is `Drive`. Click **Add**.
   * Click **+** (Services) again, look for **Google Docs API**, ensure the identifier is `Docs`, and click **Add**.

### Step 4: Authorization and Execution
1. Return to your Google Docs document tab and reload the page.
2. A new menu will appear in the top bar called **Document Exporter** (or under **Extensions** > **Add-ons**).
3. Click on **Document Exporter** > **Export to JSON...**.
4. Google will request security authorization:
   * Click **Continue**.
   * Select your Google account.
   * On the "Google hasn't verified this app" warning screen, click **Advanced**.
   * Click **Go to Document Exporter (unsafe)**.
   * Grant the required permissions by clicking **Allow**.
5. The exporter interface will open. Select the desired export method to start the download.

---

## Method 2: Internal Deployment for an Organization (Google Workspace)

If you want the add-on to be available to multiple users in your Google Workspace domain without everyone having to manually copy the code, you must publish it as an internal organization add-on.

### Prerequisites
* An admin or developer account in the Google Workspace console.
* Access to Google Cloud Console with permissions to create projects in the organization.

### Step 1: Create a Standalone Script
1. Go to [script.google.com](https://script.google.com/) with your organizational account.
2. Create a **New project**.
3. Copy and configure the `Code.gs`, `download.html`, and the manifest `appsscript.json` files as described in Method 1 (enabling manifest visibility).

### Step 2: Link to a Google Cloud Project (GCP)
1. In the Apps Script editor, go to **Project Settings** (gear icon).
2. Check the box **Show "appsscript.json" manifest file in editor**.
3. Go to [Google Cloud Console](https://console.cloud.google.com/).
4. Create a new GCP project specifically for this add-on.
5. Copy the **Project number** (available on the GCP project info dashboard).
6. Return to the Apps Script project settings, click **Change project**, and enter the GCP Project Number.

### Step 3: Configure OAuth Consent Screen
1. In Google Cloud Console, go to **APIs & Services** > **OAuth consent screen**.
2. Select **Internal** as the User Type so that only accounts from your organization can access it.
3. Fill out the required fields of the application profile.
4. In the **Scopes** section, manually add the permissions required by the script:
   * `https://www.googleapis.com/auth/documents.currentonly` (active document access)
   * `https://www.googleapis.com/auth/drive.readonly` (reading comments via Drive API)
   * `https://www.googleapis.com/auth/documents` (if using advanced Docs API)
5. Save and continue.

### Step 4: Publish the Editor Add-on
1. In Google Cloud Console, go to **APIs & Services** > **Library**.
2. Search for and enable the **Google Workspace Marketplace SDK** API.
3. After enabling it, go to **APIs & Services** > **Google Workspace Marketplace SDK** > **App Configuration**.
4. Configure the editor add-on integration parameters:
   * Check the **Google Docs add-on** box.
   * In **Apps Script project ID**, enter the ID of your Apps Script script (available in the Apps Script project settings).
   * Define the script deployment version.
5. Go to the **Store Listing** tab within the Marketplace SDK:
   * Fill out the listing information (name, descriptions, screenshots, icons). *Note: you can generate and import icons in the required dimensions using the [resize_icons.py](file:///C:/Users/jgjua/Documents/antigravity/lucid-davinci/resize_icons.py) script from this repository*.
   * In the visibility section, make sure to select **Private (only for domain users)**.
   * Click **Publish**.

### Step 5: Installation by Users
Once published in the organization's Workspace Marketplace:
* **Individual Installation:** Domain users can go to a Google Docs document, select **Extensions** > **Add-ons** > **Get add-ons**, search for the application in the internal organization tab, and install it.
* **Forced Installation (Admin Console):** The Workspace administrator can go to the Google Admin console, search for the internally published application, and automatically force its installation for the entire organization or specific organizational units.
