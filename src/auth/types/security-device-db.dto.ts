export type SecurityDeviceDbDto = {
    ip: string;
    title: string;
    lastActivateDate: number;
    deviceId: string;
    userId: string,
    expiryDate: number;
}

export type GETsecurityDeviceDbDto = Omit<SecurityDeviceDbDto, 'userId'| 'expiryDate'>
export type UPDATEsecurityDeviceDbDto = Omit<SecurityDeviceDbDto, 'userId'| 'deviceId'>
