import { redirect } from 'next/navigation';

/**
 * Settings Page Redirect
 * 
 * This page redirects to the workspace settings page.
 * The sidebar links to /settings but the actual settings page is at /settings/workspace.
 */
export default function SettingsPage() {
    redirect('/settings/workspace');
}
