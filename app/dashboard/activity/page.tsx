import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getActivityLogs } from '@/lib/actions/activity'
import { 
  Activity, 
  ShoppingCart, 
  FolderTree, 
  User, 
  Settings,
  Plus,
  Edit,
  Trash2,
  LogIn,
  Key
} from 'lucide-react'

const actionIcons: Record<string, typeof Activity> = {
  'Created sale': Plus,
  'Updated sale': Edit,
  'Deleted sale': Trash2,
  'Created category': Plus,
  'Updated category': Edit,
  'Deleted category': Trash2,
  'Updated profile': User,
  'Changed password': Key,
  'Logged in': LogIn,
}

const entityIcons: Record<string, typeof Activity> = {
  'sale': ShoppingCart,
  'category': FolderTree,
  'profile': User,
  'settings': Settings,
}

export default async function ActivityPage() {
  const logs = await getActivityLogs(100)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Activity Log</h2>
        <p className="text-slate-500 mt-1">Track all your actions and changes</p>
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-4">
                <Activity className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-slate-600">No activity yet.</p>
              <p className="text-sm text-slate-500 mt-1">Your actions will be logged here.</p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200" />
              <div className="space-y-6">
                {logs.map((log, index) => {
                  const ActionIcon = actionIcons[log.action] || Activity
                  const EntityIcon = entityIcons[log.entity_type || ''] || Activity
                  const isFirst = index === 0

                  return (
                    <div key={log.id} className="relative flex gap-4">
                      <div
                        className={`relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${
                          isFirst ? 'bg-blue-100' : 'bg-slate-100'
                        }`}
                      >
                        <ActionIcon
                          className={`h-5 w-5 ${isFirst ? 'text-blue-600' : 'text-slate-500'}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0 pt-1.5">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-slate-900">{log.action}</p>
                          {log.entity_type && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                              <EntityIcon className="h-3 w-3" />
                              {log.entity_type}
                            </span>
                          )}
                        </div>
                        {log.details && Object.keys(log.details).length > 0 && (
                          <div className="mt-1 text-sm text-slate-500">
                            {Object.entries(log.details).map(([key, value]) => (
                              <span key={key} className="mr-3">
                                <span className="text-slate-400">{key}:</span>{' '}
                                <span className="text-slate-600">{String(value)}</span>
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="mt-1 text-xs text-slate-400">
                          {new Date(log.created_at).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
