import {ExternalToast, toast as sToast, ToasterProps} from "sonner"

    const config = { 
        dismissible: true,
        cancel: { label: 'close', onClick: () => {} } 
    }

    const  error = (message: string | React.ReactNode, data?: ExternalToast): string | number =>  {
        sToast.dismiss();
        return sToast.error(message, {...config, ...data  });
    }

    const  success = (message: string | React.ReactNode, data?: ExternalToast): string | number => {
        sToast.dismiss();
        return sToast.success(message, {...config, ...data  });
    }

    const  info = (message: string | React.ReactNode, data?: ExternalToast): string | number =>  {
        sToast.dismiss();
        return sToast.info(message, {...config, ...data  });
    }

    const  warning = (message: string | React.ReactNode, data?: ExternalToast): string | number =>  {
        sToast.dismiss();
        return sToast.warning(message, {...config, ...data  });
    }

    const  loading = (message: string | React.ReactNode, data?: ExternalToast): string | number =>  {
        sToast.dismiss();
        return sToast.loading(message, data);
    }

    const  custom = (jsx: (id: number | string) => React.ReactElement, data?: ExternalToast) : string | number => {
        sToast.dismiss();
        return sToast.custom(jsx, {...config, ...data  });
    }


export default  {

    error,
    success,
    warning,
    info,
    custom,
    loading,
    dismiss(id?: number | string): string | number {
        return sToast.dismiss(id);
    }

}
