import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

function PrivacyPolicy() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="mb-8"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>

                {/* Content */}
                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <h1 className="text-4xl font-bold mb-8">PRIVACY POLICY</h1>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-6 mb-8">
                        <h2 className="text-2xl font-bold mb-4 mt-0">⚠️ READ THIS FIRST</h2>
                        <p className="text-lg font-semibold mb-2">THIS IS A HOBBY PROJECT. ZERO GUARANTEES. ZERO LIABILITY. USE AT YOUR OWN RISK.</p>
                        <p>If you need privacy guarantees, data security, or legal protections → <strong>DON'T USE THIS SERVICE.</strong></p>
                    </div>

                    <hr className="my-8" />

                    <h2>1. WHAT WE ARE</h2>
                    <p>Echoes is a personal side project run by one person for fun.</p>
                    <p><strong>Service provided "AS-IS" with all faults. No liability</strong></p>

                    <hr className="my-8" />

                    <h2>2. WHAT DATA WE COLLECT</h2>

                    <h3>You provide:</h3>
                    <ul>
                        <li>Email, password (via Firebase)</li>
                        <li>Display name, profile picture, bio</li>
                        <li>Posts (photos, videos, documents, descriptions)</li>
                        <li>Location coordinates (manually selected on map - PUBLIC)</li>
                        <li>Comments, likes, bookmarks, follows</li>
                    </ul>

                    <h3>Automatically collected:</h3>
                    <ul>
                        <li>Firebase UID, IP address, browser info, timestamps</li>
                        <li>Usage data (pages viewed, interactions)</li>
                    </ul>

                    <hr className="my-8" />

                    <h2>3. THIRD PARTIES (YOUR DATA LEAVES OUR CONTROL)</h2>

                    <p><strong>Your data is processed by:</strong></p>

                    <h3>Firebase/Google Cloud:</h3>
                    <ul>
                        <li>ALL your data (accounts, posts, media, everything)</li>
                        <li>Their policy: <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer">https://firebase.google.com/support/privacy</a></li>
                    </ul>

                    <h3>OpenAI:</h3>
                    <ul>
                        <li>Your images (for AI analysis)</li>
                        <li>Their policy: <a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer">https://openai.com/policies/privacy-policy</a></li>
                        <li><strong>AI analysis is often wrong - not fact-checking</strong></li>
                    </ul>

                    <h3>Google Cloud Vision:</h3>
                    <ul>
                        <li>Your images (for content moderation - may not catch everything)</li>
                        <li>Their policy: <a href="https://cloud.google.com/vision/docs/data-usage" target="_blank" rel="noopener noreferrer">https://cloud.google.com/vision/docs/data-usage</a></li>
                    </ul>

                    <h3>Google Maps:</h3>
                    <ul>
                        <li>Location data, map interactions</li>
                        <li>Their policy: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy</a></li>
                    </ul>

                    <p><strong>We do NOT have Data Processing Agreements with them. We rely on their standard terms. We might extend to other third parties.</strong></p>

                    <hr className="my-8" />

                    <h2>4. HOW WE MAY USE YOUR DATA</h2>

                    <p>We may (or may not):</p>
                    <ul>
                        <li>Create and maintain accounts</li>
                        <li>Display posts and social interactions</li>
                        <li>Send images to OpenAI for AI analysis</li>
                        <li>Send images to Google for moderation (no guarantees it works)</li>
                        <li>Display locations on maps</li>
                        <li>Maybe respond to emails (no obligation)</li>
                        <li>Maybe try to fix bugs (no promises)</li>
                    </ul>

                    <p><strong>No guarantees about any of this. Usage may change without notice.</strong></p>

                    <hr className="my-8" />

                    <h2>5. WHAT'S PUBLIC</h2>

                    <h3>PUBLIC (visible to everyone, may be indexed by search engines forever):</h3>
                    <ul>
                        <li>Display name, profile picture, bio</li>
                        <li>ALL posts (descriptions, media, years)</li>
                        <li>Post location coordinates</li>
                        <li>Comments</li>
                        <li>Follower/following lists</li>
                        <li>Like/comment/bookmark counts</li>
                    </ul>

                    <hr className="my-8" />

                    <h2>6. DATA SECURITY (NONE GUARANTEED)</h2>

                    <h3>What we try:</h3>
                    <ul>
                        <li>HTTPS, Firebase Authentication, Firebase security rules</li>
                    </ul>

                    <h3>What we CANNOT guarantee:</h3>
                    <ul>
                        <li>Protection from breaches or hacking</li>
                        <li>Detection of security incidents</li>
                        <li>Notification if breaches occur</li>
                        <li>Any level of security</li>
                    </ul>

                    <h3>DO NOT UPLOAD:</h3>
                    <ul>
                        <li>IDs, financial documents, passwords</li>
                        <li>Highly personal or sensitive information</li>
                        <li>Medical records, private communications</li>
                        <li>Anything you can't afford to lose or have exposed</li>
                    </ul>

                    <p><strong>Assume your data may be compromised. Act accordingly.</strong></p>

                    <hr className="my-8" />

                    <h2>8. CHILDREN</h2>
                    <p>Not for users under 13.</p>

                    <hr className="my-8" />

                    <h2>9. CHANGES</h2>
                    <p>We may change this policy at any time without notice. Changes effective immediately. <strong>We are NOT obligated to notify you.</strong> Check periodically.</p>

                    <hr className="my-8" />

                    <h2>10. LIABILITY</h2>

                    <h3>WE ARE NOT LIABLE FOR:</h3>
                    <ul>
                        <li>Data breaches, hacking, unauthorized access</li>
                        <li>Data loss, corruption, deletion</li>
                        <li>Third-party actions (OpenAI, Google, Firebase)</li>
                        <li>Privacy violations by users</li>
                        <li>Service downtime or unavailability</li>
                        <li>Violation of privacy laws</li>
                        <li>ANY damages whatsoever</li>
                    </ul>

                    <p><strong>BY USING THIS SERVICE, YOU WAIVE ALL CLAIMS FOR DAMAGES.</strong></p>

                    <hr className="my-8" />

                    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-6">
                        <h2 className="mt-0">11. FINAL WARNING</h2>

                        <h3>BY USING THIS SERVICE, YOU ACKNOWLEDGE:</h3>
                        <ul>
                            <li>Hobby project with ZERO guarantees</li>
                            <li>Your data goes to third parties (OpenAI, Google,...)</li>
                            <li>Your posts are PUBLIC and may be indexed forever</li>
                            <li>We have NO obligation to protect your data</li>
                            <li>We may shut down without warning</li>
                            <li>We are NOT responsible for anything</li>
                            <li>You use this ENTIRELY at your own risk</li>
                        </ul>

                        <h3>IF YOU NEED:</h3>
                        <ul>
                            <li>Data security guarantees</li>
                            <li>Privacy law compliance</li>
                            <li>Liability protection</li>
                            <li>Professional service</li>
                        </ul>

                        <p><strong>THEN DO NOT USE THIS SERVICE.</strong></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PrivacyPolicy;
