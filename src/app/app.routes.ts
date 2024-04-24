import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ScrumboardComponent } from './scrumboard/scrumboard.component';
import { SummaryComponent } from './scrumboard/summary/summary.component';
import { BoardComponent } from './scrumboard/board/board.component';
import { AddTaskComponent } from './scrumboard/add-task/add-task.component';
import { ContactsComponent } from './scrumboard/contacts/contacts.component';
import { LegalNoticeComponent } from './scrumboard/legal-notice/legal-notice.component';
import { PrivacyComponent } from './scrumboard/privacy/privacy.component';
import { AboutComponent } from './scrumboard/about/about.component';
import { UserSettingsComponent } from './scrumboard/user-settings/user-settings.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    {
        path: 'scrumboard', component: ScrumboardComponent,
        children: [
            {
                path: '',
                redirectTo: 'summary',
                pathMatch: 'full'
            },
            {
                path: 'summary',
                component: SummaryComponent
            },
            {
                path: 'board',
                component: BoardComponent
            },
            {
                path: 'add-task',
                component: AddTaskComponent
            },
            {
                path: 'contacts',
                component: ContactsComponent
            },
            {
                path: 'legal-notice',
                component: LegalNoticeComponent
            },
            {
                path: 'privacy',
                component: PrivacyComponent
            },
            {
                path: 'about',
                component: AboutComponent
            },
            {
                path: 'user-settings',
                component: UserSettingsComponent
            }
        ]
    },
];
