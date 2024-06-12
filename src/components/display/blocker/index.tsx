import { Alert, Modal } from 'antd';
import { useCallbackPrompt } from '@/utils/functions/useCallbackPrompt';
import { dictionary } from '@/utils/constants/dictionary';

interface IAppRouteBlocker {
  open: boolean;
}
function AppRouteBlocker({ open }: IAppRouteBlocker) {
  const [showPrompt, confirmNavigation, cancelNavigation] =
    useCallbackPrompt(open);

  const a = () => {
    if (typeof confirmNavigation === 'function') {
      confirmNavigation(); // Call the function if it's a function
    }
  };
  const b = () => {
    if (typeof cancelNavigation === 'function') {
      cancelNavigation(); // Call the function if it's a function
    }
  };
  return (
    <div>
      <Modal
        title={dictionary.az.warning}
        open={Boolean(showPrompt)}
        onOk={a}
        onCancel={b}
        okText={dictionary.az.yesTxt}
        cancelText={dictionary.az.noTxt}
      >
        <Alert
          message={dictionary.az.dataWillBeDeleted}
          description={dictionary.az.unsavedChanges}
          type="error"
          showIcon
        />
      </Modal>
    </div>
  );
}

export default AppRouteBlocker;
